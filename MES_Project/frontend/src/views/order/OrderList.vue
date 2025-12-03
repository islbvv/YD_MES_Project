<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orderList = ref([]);

// 검색조건
const search = ref({
    ord_code: '',
    ord_name: '',
    client_name: '',
    ord_amount: '',
    ord_date_from: '',
    ord_date_to: '',
    delivery_date_from: '',
    delivery_date_to: '',
    ord_stat_name: ''
});

// 날짜 포맷팅 함수
// const formatDate = (row) => {
//     if (!row.ord_date) return '';
//     const d = new Date(row.ord_date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// };

// 주문 목록 조회
const fetchOrderList = async () => {
    try {
        const query = new URLSearchParams(search.value).toString();
        const res = await axios.get(`/api/order/list?${query}`);
        if (res.data.code === 'S200') {
            orderList.value = res.data.data;
        }
    } catch (err) {
        console.error(err);
    }
};

// 검색 초기화
const resetSearch = () => {
    search.value = {
        ord_code: '',
        ord_name: '',
        client_name: '',
        ord_amount: '',
        ord_date_from: '',
        ord_date_to: '',
        delivery_date_from: '',
        delivery_date_to: '',
        ord_stat_name: ''
    };
    fetchOrderList();
};

onMounted(() => {
    fetchOrderList();
});
</script>

<template>
    <div class="order-container">
        <div class="header-section">
            <h2 class="page-title">주문 조회</h2>
            <div class="breadcrumb">주문 > 주문 조회</div>
        </div>

        <div class="form-grid">
            <div class="card-header">
                <h3 class="card-title"><i class="pi pi-pencil mr-2 text-primary"></i>검색 조건</h3>
            </div>

            <div class="field-group">
                <label class="field-label">주문번호</label>
                <input v-model="search.ord_code" type="text" class="input" placeholder="주문번호" />
            </div>

            <div class="field-group">
                <label class="field-label">주문명</label>
                <input v-model="search.ord_name" type="text" class="input" placeholder="주문명" />
            </div>

            <div class="field-group">
                <label class="field-label">거래처</label>
                <select v-model="search.client_name" class="client-select" @change="search">
                    <option value=""></option>
                    <option value="DE1">요청</option>
                    <option value="DE2">승인</option>
                    <option value="DE4">취소</option>
                </select>
            </div>

            <div class="field-group">
                <label class="field-label">수량</label>
                <input v-model="search.ord_amount" type="number" class="input" placeholder="수량" />
                ~
                <input v-model="search.ord_amount" type="number" class="input" placeholder="수량" />
            </div>

            <div class="field-group">
                <label class="field-label">주문일자</label>
                <input v-model="search.ord_date_from" type="date" class="input" />
                ~
                <input v-model="search.ord_date_to" type="date" class="input" />
            </div>

            <div class="field-group">
                <label class="field-label">납기일</label>
                <input v-model="search.delivery_date_from" type="date" class="input" />
                ~
                <input v-model="search.delivery_date_to" type="date" class="input" />
            </div>

            <div class="field-group">
                <label class="field-label">상태</label>
                <input v-model="search.ord_stat_name" type="text" class="input" placeholder="상태" />
            </div>

            <div class="form-actions center-actions">
                <button class="px-4 py-2 bg-gray-400 rounded text-white" @click="resetSearch">초기화</button>
                <button class="px-4 py-2 bg-blue-500 rounded text-white" @click="fetchOrderList">조회</button>
            </div>
        </div>

        <div class="content-card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="pi pi-list mr-2 text-primary"></i>주문 목록
                    <span class="ml-2 text-sm font-normal text-gray-500">(총 {{ orderList.length }}건)</span>
                </h3>
            </div>

            <DataTable :value="orderList" showGridlines stripedRows responsiveLayout="scroll" class="text-sm" removableSort>
                <template #empty>
                    <div class="text-center p-4 text-gray-500">등록된 주문 목록이 없습니다.</div>
                </template>

                <Column header="No." headerClass="center-header" bodyClass="text-center" style="width: 3rem">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>

                <Column field="ord_code" header="주문번호" sortable headerClass="center-header" bodyClass="text-center" style="min-width: 100px"></Column>
                <Column field="ord_name" header="주문명" sortable headerClass="center-header" bodyClass="text-center" style="min-width: 150px"></Column>
                <Column field="ord_date" header="주문일자" sortable headerClass="center-header" bodyClass="text-center"></Column>
                <Column field="prod_name" header="제품명" sortable headerClass="center-header" bodyClass="text-center"></Column>
                <Column field="ord_amount" header="수량" sortable headerClass="center-header" bodyClass="text-center"></Column>
                <Column field="client_name" header="거래처" sortable headerClass="center-header" bodyClass="text-center"></Column>
                <Column field="delivery_date" header="납기일" sortable headerClass="center-header" bodyClass="text-center"></Column>
                <Column field="ord_stat_name" header="상태" sortable headerClass="center-header" bodyClass="text-center"></Column>
                <Column field="note" header="비고" sortable headerClass="center-header" bodyClass="text-center"></Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
/* 기본 레이아웃 스타일 */
.order-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Pretendard', 'Inter', sans-serif;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    margin: 0;
}

.breadcrumb {
    color: #6b7280;
    font-size: 0.9rem;
}

.content-card {
    background: white;
    border-radius: 12px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 2px 4px -1px rgba(0, 0, 0, 0.03);
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
}

.card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #374151;
    margin: 0;
    display: flex;
    align-items: center;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .form-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    .col-span-full {
        grid-column: 1 / -1;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .form-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.field-group {
    display: flex;
    flex-direction: column;
}

.field-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 0.5rem;
}

.required {
    color: #ef4444;
}

:deep(.bg-gray-50) {
    background-color: #f9fafb;
}

/* PrimeVue Input 100% 채우기 */
:deep(.p-inputtext),
:deep(.p-calendar),
:deep(.p-inputnumber) {
    width: 100%;
}

.form-actions {
    display: flex;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
}

.final-actions {
    display: flex;
    margin-top: 2rem;
}

.center-actions {
    justify-content: center;
}

.mr-2 {
    margin-right: 0.5rem;
}
.text-primary {
    color: var(--primary-color);
}

/* 테이블 내용 중앙 정렬 */
:deep(.text-center) {
    text-align: center !important;
}
</style>

<style>
/* PrimeVue 4 헤더 컨텐츠 클래스명 대응 */
.center-header .p-column-header-content,
.center-header .p-datatable-column-header-content {
    justify-content: center !important;
}
</style>
