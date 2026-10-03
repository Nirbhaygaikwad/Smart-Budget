import axiosInstance from '../axiosInstance';

// Get all budget goals
export const getBudgets = async () => {
  const response = await axiosInstance.get('/budgets');
  return response.data.data;
};

// Create budget goal
export const createBudget = async (budget) => {
  const response = await axiosInstance.post('/budgets', budget);
  return response.data.data;
};

// Update budget goal
export const updateBudget = async (id, budget) => {
  const response = await axiosInstance.put(`/budgets/${id}`, budget);
  return response.data.data;
};

// Delete budget goal
export const deleteBudget = async (id) => {
  const response = await axiosInstance.delete(`/budgets/${id}`);
  return response.data.data;
};
