import api from '../../api/qc/qcApi';

// 004
export const getQcList = (criteria) => api.post(`/qc/list`, criteria);

//  005
export const getPendingList = () => api.get(`/qc/pending-list`);

export const getInstruction = (qirCode) => api.get(`/qc/Instruction/${qirCode}`);

export const saveResult = (data) => api.put(`/qc/save`, data);
