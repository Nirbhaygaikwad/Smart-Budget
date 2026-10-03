// src/axios.js
import axios from 'axios';
import { BASE_URL } from './utils/url';

const API = axios.create({
  baseURL: BASE_URL.replace(/\/v1$/, ''),
});

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
