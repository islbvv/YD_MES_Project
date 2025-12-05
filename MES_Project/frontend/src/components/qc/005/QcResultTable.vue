<script setup>
import { storeToRefs } from 'pinia';
import { useQcResultStore } from '@/stores/qc/qcResultStore';

const qcStore = useQcResultStore();
const { resultItems } = storeToRefs(qcStore);
</script>

<template>
    <DataTable :value="resultItems" showGridlines size="small">
        <!-- 선택 체크박스 -->
        <Column header="">
            <template #body="{ data }">
                <Checkbox v-model="data.selected" />
            </template>
        </Column>

        <Column field="item" header="검사항목" />
        <Column field="top" header="기준값(상)" />
        <Column field="bottom" header="기준값(하)" />
        <Column field="unit" header="단위" />

        <Column field="value" header="검사값">
            <template #body="{ data }">
                <InputText v-model="data.value" />
            </template>
        </Column>

        <Column field="judge" header="판정">
            <template #body="{ data }">
                <InputText v-model="data.judge" readonly />
            </template>
        </Column>

        <Column field="note" header="비고">
            <template #body="{ data }">
                <InputText v-model="data.note" />
            </template>
        </Column>
    </DataTable>
</template>
