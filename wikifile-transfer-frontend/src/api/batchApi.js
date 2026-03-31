import axios from 'axios';
import { mockBatchResponse, mockBatchStatusResponse } from './mockData';

const BASE_URL = '/api';

export const startBatchUpload = async (payload) => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return new Promise((resolve) => setTimeout(() => resolve(mockBatchResponse), 800));
  }
  const response = await axios.post(`${BASE_URL}/batch-upload`, payload);
  return response.data;
};

export const getBatchStatus = async (batchId) => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return new Promise((resolve) => setTimeout(() => resolve(mockBatchStatusResponse(batchId)), 500));
  }
  const response = await axios.get(`${BASE_URL}/batch-status/${batchId}`);
  return response.data;
};
