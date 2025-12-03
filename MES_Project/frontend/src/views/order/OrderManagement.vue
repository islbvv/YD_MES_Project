<template>
    <div class="order-page">
        <!-- 메인 카드: 주문 기본정보 + 버튼 -->
        <section class="card main-card">
            <div class="card-header">
                <h3>주문기본정보</h3>
                <div class="actions">
                    <button class="btn danger" @click="deleteOrder">삭제</button>
                    <button class="btn ghost" @click="resetForm">초기화</button>
                    <button class="btn" @click="saveOrder">저장</button>
                    <button class="btn outline" @click="showOrderModal = true">주문정보 불러오기</button>
                    <SearchSelectModal
                        v-model="showOrderModal"
                        searchPlaceholder="주문명 또는 코드 입력"
                        :columns="[
                            { field: 'ord_code', label: '주문코드' },
                            { field: 'ord_name', label: '주문명' },
                            { field: 'client_name', label: '거래처' }
                        ]"
                        :rows="orderRows"
                        rowKey="ord_code"
                        @search="searchOrders"
                        @confirm="onOrderSelect"
                    />
                </div>
            </div>

            <div class="form-grid">
                <div class="form-row">
                    <label>주문번호</label>
                    <input v-model="order.ord_code" type="text" :readonly="order.readonly" />

                    <label>주문명</label>
                    <input v-model="order.ord_name" type="text" />
                </div>

                <div class="form-row">
                    <label>주문일자</label>
                    <input v-model="order.ord_date" type="date" />

                    <label>거래처</label>
                    <select v-model="order.client_name">
                        <option value="">거래처를 선택해주세요.</option>
                        <option v-for="c in clientList" :key="c.client_code" :value="c.client_name">{{ c.client_name }}</option>
                    </select>
                </div>

                <div class="form-row">
                    <label>거래처담당자</label>
                    <select v-model="order.client_contact">
                        <option value=""></option>
                        <option v-for="manager in managerList" :key="manager.emp_code" :value="manager.emp_name">{{ manager.emp_name }}</option>
                    </select>

                    <label>비고</label>
                    <input v-model="order.note" type="text" />
                </div>
            </div>
        </section>

        <!-- 제품 테이블 -->
        <section class="card product-card">
            <div class="card-header small">
                <h4>제품</h4>
                <div class="product-actions">
                    <button class="btn small danger" @click="removeSelectedProducts">제품삭제</button>
                    <button class="btn small" @click="addProduct">제품추가</button>
                </div>
            </div>

            <table class="product-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" @change="toggleSelectAll($event)" :checked="allSelected" /></th>
                        <th>제품명</th>
                        <th>유형</th>
                        <th>수량</th>
                        <th>단가</th>
                        <th>납기일</th>
                        <th>우선순위</th>
                        <th>총액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(p, idx) in products" :key="p.id">
                        <td class="center"><input type="checkbox" v-model="p._selected" /></td>
                        <td>
                            <div class="prod-name">
                                <input v-model="p.prod_name" type="text" />
                                <button class="icon" @click="openProductSearch(idx)" title="제품 검색">🔍</button>
                            </div>
                        </td>
                        <td>
                            <input v-model="p.type" type="text" placeholder="분류명" />
                        </td>
                        <td><input v-model.number="p.amount" type="number" min="0" @input="recalcRow(idx)" />개</td>
                        <td><input v-model.number="p.unit_price" type="number" min="0" @input="recalcRow(idx)" />원</td>
                        <td>
                            <input v-model="p.delivery_date" type="date" />
                        </td>
                        <td>
                            <select v-model.number="p.priority">
                                <option value=""></option>
                                <option v-for="n in 3" :key="n" :value="n - 1">{{ n - 1 }}</option>
                            </select>
                        </td>
                        <td class="right">{{ formatCurrency(p.total) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="product-footer">
                <div class="total-label">전체 주문 총액</div>
                <div class="total-amount">{{ formatCurrency(totalSum) }}</div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import SearchSelectModal from '@/components/common/SearchSelectModal.vue';

// 모달 ON/OFF
const showOrderModal = ref(false);

// 검색 결과
const orderRows = ref([]);

// 모달 검색 이벤트
const searchOrders = async (keyword) => {
    const res = await axios.get('/api/order/search', { params: { keyword } });
    orderRows.value = res.data.data;
};

// 모달에서 선택한 결과 받기
const onOrderSelect = (row) => {
    console.log('선택된 주문:', row);

    form.ord_code = row.ord_code;
    form.ord_name = row.ord_name;
    form.client_name = row.client_name;
};

// 주문 기본 정보
const order = reactive({
    ord_code: '',
    ord_name: '',
    ord_date: new Date().toISOString().slice(0, 10),
    client_name: '',
    client_contact: '',
    note: '',
    readonly: false
});

const clientList = ref([]); // 거래처 목록
const managerList = ref([]); // 거래처 담당자 목록

// 제품 목록: 기본 4행
const products = ref([createEmptyProduct(1), createEmptyProduct(2), createEmptyProduct(3), createEmptyProduct(4)]);
let nextProductId = 5;

function createEmptyProduct(id) {
    return {
        id,
        prod_name: '',
        type: '',
        amount: 0,
        unit_price: 0,
        delivery_date: '',
        priority: '',
        _selected: false,
        get total() {
            return (Number(this.amount) || 0) * (Number(this.unit_price) || 0);
        }
    };
}

// 총합
const totalSum = computed(() => products.value.reduce((acc, p) => acc + Number(p.amount || 0) * Number(p.unit_price || 0), 0));

// 초기 데이터 조회
const fetchClientList = async () => {
    try {
        const res = await axios.get('/api/order/client/list');
        if (res.data.code === 'S200') clientList.value = res.data.data;
    } catch (e) {
        console.error(e);
    }
};

const fetchManagerList = async () => {
    try {
        const res = await axios.get('/api/order/manager/list');
        if (res.data.code === 'S200') managerList.value = res.data.data;
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    fetchClientList();
    fetchManagerList();
});

// 제품 추가/삭제
function addProduct() {
    products.value.push(createEmptyProduct(nextProductId++));
}

function removeSelectedProducts() {
    const before = products.value.length;
    products.value = products.value.filter((p) => !p._selected);
    // 최소 1행 유지
    if (products.value.length === 0) products.value.push(createEmptyProduct(nextProductId++));
}

function toggleSelectAll(ev) {
    const checked = ev.target.checked;
    products.value.forEach((p) => (p._selected = checked));
}

const allSelected = computed(() => products.value.length > 0 && products.value.every((p) => p._selected));

function recalcRow(idx) {
    // Vue reactivity for getter total works; but ensure numeric
    const p = products.value[idx];
    p.amount = Number(p.amount) || 0;
    p.unit_price = Number(p.unit_price) || 0;
}

// 버튼 액션 (샘플 구현)
function resetForm() {
    order.ord_code = '';
    order.ord_name = '';
    order.client_name = '';
    order.client_contact = '';
    order.note = '';
    products.value = [createEmptyProduct(nextProductId++), createEmptyProduct(nextProductId++), createEmptyProduct(nextProductId++), createEmptyProduct(nextProductId++)];
}

function saveOrder() {
    // 실제 저장 로직: 유효성 검사 후 API 호출
    const payload = {
        order: { ...order },
        products: products.value.map((p) => ({ prod_name: p.prod_name, type: p.type, amount: p.amount, unit_price: p.unit_price, delivery_date: p.delivery_date, priority: p.priority }))
    };
    console.log('저장 payload', payload);
    // axios.post('/api/order/save', payload)...
    alert('저장 동작 (샘플): 콘솔을 확인하세요.');
}

function deleteOrder() {
    if (!order.ord_code) {
        alert('삭제할 주문번호가 없습니다.');
        return;
    }
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // axios.delete(`/api/order/${order.ord_code}`)...
    alert('삭제 동작 (샘플)');
}

function openProductSearch(idx) {
    // 모달 띄워 제품 검색 후 선택하는 UI 필요
    const name = prompt('검색 제품명을 입력하세요');
    if (name) products.value[idx].prod_name = name;
}

// 포맷터
function formatCurrency(v) {
    const n = Number(v || 0);
    return n.toLocaleString('ko-KR') + ' 원';
}
</script>

<style scoped>
.order-page {
    font-family: 'Pretendard', 'Inter', sans-serif;
    padding: 24px;
    background: #f8f9fa;
}
.top-summary {
    background: #fffbea;
    border: 1px solid #e6d9a9;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
}
.summary-row {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
}
.summary-row .cell {
    padding: 8px 12px;
    border: 1px solid #f0e5b8;
    background: #fff;
    border-radius: 4px;
    font-size: 13px;
}
.summary-row .cell.title {
    flex: 1;
}
.summary-desc {
    font-size: 13px;
    color: #6b6b6b;
}

.card {
    background: white;
    border-radius: 10px;
    padding: 14px;
    border: 1px solid #e6e6e6;
    margin-bottom: 18px;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.card-header.small {
    padding-bottom: 6px;
    border-bottom: 1px dashed #eee;
}
.card h3,
.card h4 {
    margin: 0;
}

.actions {
    display: flex;
    gap: 8px;
}
.btn {
    background: #2563eb;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}
.btn.ghost {
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
}
.btn.outline {
    background: #fff;
    color: #2563eb;
    border: 1px solid #c7ddff;
}
.btn.danger {
    background: #ef4444;
}
.btn.small {
    padding: 6px 8px;
    font-size: 13px;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.form-row {
    display: flex;
    gap: 12px;
    align-items: center;
}
.form-row label {
    width: 110px;
    font-weight: 600;
    color: #374151;
}
.form-row input[type='text'],
.form-row input[type='date'],
.form-row select {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
}

.product-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
}
.product-table th,
.product-table td {
    border: 1px solid #eee;
    padding: 10px;
    font-size: 14px;
}
.product-table th {
    background: #fafafa;
    text-align: left;
}
.product-table td.center {
    text-align: center;
}
.product-table td.right {
    text-align: right;
}

.prod-name {
    display: flex;
    gap: 8px;
    align-items: center;
}
.prod-name .icon {
    background: transparent;
    border: none;
    cursor: pointer;
}

.product-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
}
.total-label {
    font-weight: 700;
    color: #374151;
}
.total-amount {
    font-size: 20px;
    color: #f59e0b;
    font-weight: 800;
}
</style>
