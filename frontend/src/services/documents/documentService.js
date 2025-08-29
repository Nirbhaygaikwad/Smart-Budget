import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/documents';

// Upload document
export const uploadDocument = async (formData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.post(API_URL, formData, config);
    return response.data;
};

// Get user's documents
export const getDocuments = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};

// Download document
export const downloadDocument = async (documentId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
    };

    const response = await axios.get(`${API_URL}/${documentId}`, config);
    return response.data;
};

// Delete document
export const deleteDocument = async (documentId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.delete(`${API_URL}/${documentId}`, config);
    return response.data;
};
