import axios from './axios';

export const login = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await axios.post('/auth/register', { email, password });
  return response.data;
};
