import { defineStore } from 'pinia';

export const useWorkStore = defineStore('work', {
    state: () => ({
        selectedWork: null
    }),
    actions: {
        setSelectedWork(data) {
            this.selectedWork = data;
        }
    }
});
