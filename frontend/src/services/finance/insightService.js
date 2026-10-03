import axiosInstance from '../axiosInstance';

// Get category-wise expense breakdown
export const getCategoryExpenses = async () => {
  const response = await axiosInstance.get('/api/finance/category-expenses');
  return response.data;
};

// Get financial insights and recommendations
export const getFinancialInsights = async () => {
  const response = await axiosInstance.get('/api/finance/insights');
  return response.data;
};

// Get spending patterns
export const getSpendingPatterns = async () => {
  const response = await axiosInstance.get('/api/finance/spending-patterns');
  return response.data;
};
