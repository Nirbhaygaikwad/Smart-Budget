import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/transactions';

// Create new transaction
export const createTransaction = async (transactionData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.post(API_URL, transactionData, config);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create transaction';
    }
};

// Get user's transactions
export const getTransactions = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch transactions';
    }
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.put(`${API_URL}/${id}`, transactionData, config);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update transaction';
    }
};

// Delete transaction
export const deleteTransaction = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.delete(`${API_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete transaction';
    }
};
