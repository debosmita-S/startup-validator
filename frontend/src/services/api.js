import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Intercept requests to add the Authorization token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth Routes
export const requestOTP = async (identifier) => {
    const res = await api.post('/api/auth/request-otp', { identifier });
    return res.data;
};

export const verifyOTP = async (identifier, otp) => {
    const res = await api.post('/api/auth/verify-otp', { identifier, otp });
    return res.data;
};

// Analysis Routes
export const analyzeIdea = async (idea, description = '') => {
    const res = await api.post('/api/analyze', { idea, description });
    return res.data;
};

export const generatePivot = async (idea, viability_score) => {
    const res = await api.post('/api/pivot', { idea, viability_score });
    return res.data;
};

export const getAllAnalyses = async () => {
    const res = await api.get('/api/history');
    return res.data;
};

export const getAnalysis = async (id) => {
    const res = await api.get(`/api/history/${id}`);
    return res.data;
};

export const deleteAnalysis = async (id) => {
    const res = await api.delete(`/api/history/${id}`);
    return res.data;
};

export default api;
