import { defineStore } from 'pinia';
import { getQcResultList, saveQcResult } from '../../service/qc/qcService';

export const useQcResultStore = defineStore('qcResult', {
    state: () => ({
        basic: {
            qir_code: '',
            qcr_code: '',
            qio_code: '',
            qir_emp_code: '',
            start_date: '',
            end_date: '',
            result: '',
            defect_qty: '',
            note: ''
        },

        instruction: {
            instrCode: '',
            productName: '',
            processName: '',
            type: '',
            qty: ''
        },

        modal: {
            resultSelectVisible: false,
            resultRows: [],
            selectedRow: null
        },

        // 테이블 데이터
        resultItems: [],

        // 모달에서 선택된 검사결과코드
        selectedQir: ''
    }),

    actions: {
        async loadResult() {
            const res = await getQcResultList(this.selectedQir);
            this.basic = res.data.basic;
            this.instruction = res.data.instruction;
            this.resultItems = res.data.items;
        },

        async saveResult() {
            const payload = {
                basic: this.basic,
                instruction: this.instruction,
                items: this.resultItems
            };
            await saveQcResult(payload);
        },

        openResultModal(rows) {
            this.modal.resultRows = rows;
            this.modal.resultSelectVisible = true;
        },

        closeResultModal() {
            this.modal.resultSelectVisible = false;
        },

        confirmResultSelection() {
            this.selectedQir = this.modal.selectedRow?.qir_code;
            this.closeResultModal();
        }
    }
});
