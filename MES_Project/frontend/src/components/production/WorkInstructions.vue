<script setup>
import { reactive, watch, ref, defineProps, defineEmits } from 'vue';
import ProductSelectModal from '@/components/order/ProductSelectModal.vue';

const emit = defineEmits(['update:workOrderData']);

// 🔹 부모에서 전달된 props 정의
const props = defineProps({
    workOrderData: {
        type: Object,
        default: () => ({
            productName: '',
            instructionQuantity: '',
            startDate: '',
            expectedCompletion: '',
            instructionStatus: 'v4', // 💡 초기 상태를 '작업대기' (v4)로 설정
            lineType: '',
            lineCode: '' // 생산 계획 번호로 사용될 가능성이 높음
        })
    },
    labels: {
        type: Object,
        default: () => ({
            header: '작업지시사항',
            productName: '제품명',
            instructionQuantity: '지시수량',
            startDate: '작업시작일시',
            expectedCompletion: '예상 완료일시',
            instructionStatus: '지시 상태',
            lineType: '라인 유형',
            lineCode: '라인 코드' // 이 필드를 생산 계획 번호로 간주
        })
    },
    statusOptions: {
        type: Array,
        default: () => [
            { label: '진행중', value: 'v1' },
            { label: '작업완료', value: 'v2' },
            { label: '작업보류', value: 'v3' },
            { label: '작업대기', value: 'v4' } // 💡 '작업대기'의 value를 'v4'로 가정합니다.
        ]
    }
});

// 🔹 props를 내부 reactive로 복사 (v-model용)
const localWorkOrder = reactive({ ...props.workOrderData });

// 💡 모달 표시 상태 관리 및 핸들러 (이전과 동일)
const showProductModal = ref(false);
const openProductModal = () => {
    showProductModal.value = true;
};
const handleProductSelect = (payload) => {
    if (payload && payload.row) {
        const selectedProduct = payload.row;
        localWorkOrder.productName = selectedProduct.prod_name || '';
        localWorkOrder.lineCode = selectedProduct.prod_code || '';
    }
    showProductModal.value = false;
};

// --- ✨ 추가/수정된 로직 ---

// 1. 라인 코드 (생산 계획 번호) 변경 감시 및 라인 유형 업데이트
watch(
    () => localWorkOrder.lineCode,
    (newLineCode) => {
        // 라인 유형 ('정형'/'비정형') 업데이트
        localWorkOrder.lineType = newLineCode ? '정형' : '비정형';

        // 💡 2. 라인 코드 값 유무에 따라 지시 상태를 '작업대기' (v4)로 설정
        //     단, 이미 '진행중' 등 다른 상태라면 덮어쓰지 않도록 조건 추가 (필요에 따라 조절)
        if (!newLineCode) {
            // 생산 계획 번호가 비어있다면, 강제로 '작업대기'로 설정
            localWorkOrder.instructionStatus = 'v4';
        }
    },
    { immediate: true }
);

// 🔥 props 변경 시 localWorkOrder 즉시 업데이트
watch(
    () => props.workOrderData,
    (newVal) => {
        localWorkOrder.productName = newVal.productName || '';
        localWorkOrder.instructionQuantity = newVal.instructionQuantity || '';
        localWorkOrder.startDate = newVal.startDate || '';
        localWorkOrder.expectedCompletion = newVal.expectedCompletion || '';

        // 지시 상태의 초기값 설정 (props에서 받은 값 우선, 없으면 '작업대기' (v4))
        localWorkOrder.instructionStatus = newVal.instructionStatus || 'v4';

        localWorkOrder.lineCode = newVal.lineCode || '';
        localWorkOrder.lineType = newVal.lineType || (newVal.lineCode ? '정형' : '비정형');
    },
    { deep: true, immediate: true }
);

// 🔹 localWorkOrder 변경 → 부모에게 자동 emit
watch(
    localWorkOrder,
    (newVal) => {
        emit('update:workOrderData', { ...newVal });
    },
    { deep: true }
);
</script>

<template>
    <div class="work-instruction-card p-5">
        <div class="header-section flex justify-between items-center mb-5 pb-2 border-b-2 border-b-gray-300">
            <h5 class="text-xl font-bold text-gray-800">{{ labels.header }}</h5>
        </div>

        <div class="form-grid grid grid-cols-2 bg-white border-t-4 border-red-500">
            <div class="grid-row border-b border-r border-gray-200">
                <label class="label-col">{{ labels.productName }}</label>
                <div class="input-col">
                    <input type="text" v-model="localWorkOrder.productName" @click="openProductModal" readonly class="input-field-style-compact product-select-field" />
                </div>
            </div>

            <div class="grid-row border-b border-gray-200">
                <label class="label-col">{{ labels.instructionQuantity }}</label>
                <div class="input-col">
                    <input type="text" v-model="localWorkOrder.instructionQuantity" class="input-field-style-compact text-right" />
                    <span class="text-sm text-gray-500 ml-2">(개)</span>
                </div>
            </div>

            <div class="grid-row border-b border-r border-gray-200">
                <label class="label-col">{{ labels.startDate }}</label>
                <div class="input-col">
                    <input type="datetime-local" v-model="localWorkOrder.startDate" class="input-field-style-compact" />
                </div>
            </div>

            <div class="grid-row border-b border-gray-200">
                <label class="label-col">{{ labels.expectedCompletion }}</label>
                <div class="input-col">
                    <input type="datetime-local" v-model="localWorkOrder.expectedCompletion" class="input-field-style-compact" />
                </div>
            </div>

            <div class="grid-row border-b border-r border-gray-200">
                <label class="label-col">{{ labels.instructionStatus }}</label>
                <div class="input-col">
                    <input type="text" :value="statusOptions.find((opt) => opt.value === localWorkOrder.instructionStatus)?.label || '알 수 없음'" class="input-field-style-compact read-only-status" readonly />
                </div>
            </div>

            <div class="grid-row border-b border-gray-200">
                <label class="label-col">{{ labels.lineType }}</label>
                <div class="input-col">
                    <input type="text" v-model="localWorkOrder.lineType" class="input-field-style-compact" readonly />
                </div>
            </div>

            <div class="grid-row border-r border-gray-200">
                <label class="label-col">{{ labels.lineCode }}</label>
                <div class="input-col">
                    <input type="text" v-model="localWorkOrder.lineCode" class="input-field-style-compact" />
                </div>
            </div>

            <div class="grid-row border-gray-200">
                <label class="label-col bg-white"></label>
                <div class="input-col bg-white"></div>
            </div>
        </div>
    </div>

    <ProductSelectModal :model-value="showProductModal" @update:model-value="(val) => (showProductModal = val)" @select="handleProductSelect" />
</template>

<style scoped>
.work-instruction-card {
    background-color: #ffffff;
    border-radius: 7px;
    width: 100%;
    margin-bottom: 24px;
    border: 1px solid #e0e0e0;
}
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-collapse: collapse;
}
.grid-row {
    display: grid;
    grid-template-columns: 130px 1fr;
    min-height: 45px;
}
.label-col {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    padding: 0 12px;
    border-right: 1px solid #e5e7eb;
}
.input-col {
    display: flex;
    align-items: center;
    padding: 6px 12px;
}
.input-field-style-compact {
    width: 100%;
    font-size: 15px;
    border: 1px solid #d1d5db;
    padding: 4px 8px;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}
.input-field-style-compact:focus {
    outline: none;
    border-color: #3b82f6;
}
.select-field {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 25px !important;
}
.product-select-field {
    cursor: pointer;
    background-color: #f9f9f9;
}
.read-only-status {
    cursor: default;
    background-color: #f0f0f0; /* 읽기 전용임을 시각적으로 표현 */
}
.product-select-field {
    cursor: pointer;
    background-color: #f9f9f9;
}
</style>
