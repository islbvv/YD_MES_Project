<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import DefaultInfo from '../../components/production/DefaultInfo.vue';
import WorkInstructions from '../../components/production/WorkInstructions.vue';
import NonStandardProcess from '../../components/production/NonStandardProcess.vue';

const API_URL = '/api/production/plan';
const searchCriteria = ref({});
const allRows = ref([]);
const isLoading = ref(false);

const otherDataFromChild = ref(null); // DefaultInfo에서 받은 값

const fetchWorkData = async (params = {}) => {
    isLoading.value = true;
    try {
        const response = await axios.get(API_URL, { params });
        allRows.value = response.data.data || [];
    } catch (error) {
        console.error('❌ 작업 데이터 로드 실패:', error);
        alert('데이터 로드 실패');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => fetchWorkData());

const handleSearch = (form) => {
    searchCriteria.value = form;
    fetchWorkData(form);
};

const handleReset = () => {
    searchCriteria.value = {};
    fetchWorkData();
};

const downloadExcel = () => {
    console.log('엑셀 다운로드:', searchCriteria.value);
};

// 🔹 자식(DefaultInfo)에서 전달된 값 받기
const handleOtherData = (data) => {
    otherDataFromChild.value = data;
    console.log('부모에서 받은 otherData:', data);
};

const filteredRows = computed(() => allRows.value);
</script>

<template>
    <div class="forward-check-page">
        <!-- DefaultInfo: 이벤트 바인딩 -->
        <DefaultInfo :plan-data="filteredRows" @updateOtherData="handleOtherData" @search="handleSearch" @reset="handleReset" />

        <!-- WorkInstructions: 부모가 받은 otherDataFromChild 전달 -->
        <WorkInstructions :other-data="otherDataFromChild" />

        <div v-if="isLoading" class="p-4 text-center text-lg text-blue-500 font-semibold">데이터 로드 중...</div>

        <NonStandardProcess v-else :rows="filteredRows" @download="downloadExcel" />
    </div>
</template>

<style scoped>
.forward-check-page {
    padding: 1.5rem;
    background: #f5f6fa;
    width: 100%;
    box-sizing: border-box;
}
</style>
