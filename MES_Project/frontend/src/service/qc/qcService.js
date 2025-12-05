import api from '../../api/api';

export const getInstructionByQir = (qirCode) => api.get(`/qc/instruction/${qirCode}`);

export const getQcResultList = (qirCode) => api.get(`/qc/qir/${qirCode}`);

export const saveQcResult = (data) => api.post(`/qc/save`, data);
