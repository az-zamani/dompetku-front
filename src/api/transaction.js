import axios from './axios';

export const getTransactions = async () => {
  const response = await axios.get('/transactions');
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await axios.post('/transactions', data);
  return response.data;
};
