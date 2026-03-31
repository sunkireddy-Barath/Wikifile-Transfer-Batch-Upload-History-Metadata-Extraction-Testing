import axios from 'axios';
import { mockHistoryResponse } from './mockData';

const BASE_URL = '/api';

export const getHistory = async (params) => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return new Promise((resolve) => setTimeout(() => resolve(mockHistoryResponse), 800));
  }
  const response = await axios.get(`${BASE_URL}/history`, { params });
  return response.data;
};

export const retryTransfer = async (transferId) => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return new Promise((resolve) => setTimeout(() => resolve({ new_task_id: `celery-${Math.random().toString(36).substring(7)}`, status: 'queued' }), 500));
  }
  const response = await axios.post(`${BASE_URL}/retry/${transferId}`);
  return response.data;
};
