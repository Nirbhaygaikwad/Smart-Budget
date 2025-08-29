import axiosInstance from '../axiosInstance';

// Get category-wise expense breakdown
export const getCategoryExpenses = async () => {
  try {
    const response = await axiosInstance.get('/api/finance/category-expenses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get financial insights and recommendations
export const getFinancialInsights = async () => {
  try {
    const response = await axiosInstance.get('/api/finance/insights');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get spending patterns
export const getSpendingPatterns = async () => {
  try {
    const response = await axiosInstance.get('/api/finance/spending-patterns');
    return response.data;
  } catch (error) {
    throw error;
  }
};
