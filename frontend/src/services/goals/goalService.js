import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/goals';

// Create new goal
export const createGoal = async (goalData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(API_URL, goalData, config);
    return response.data;
};

// Get user's goals
export const getGoals = async () => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};

// Update goal
export const updateGoal = async (goalId, goalData) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.put(`${API_URL}/${goalId}`, goalData, config);
    return response.data;
};

// Delete goal
export const deleteGoal = async (goalId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.delete(`${API_URL}/${goalId}`, config);
    return response.data;
};
