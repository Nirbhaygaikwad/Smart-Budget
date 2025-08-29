import axiosInstance from "../axiosInstance";

// Get Finance Summary
const getSummary = async () => {
  const response = await axiosInstance.get("/finance/summary");
  return response.data;
};

export { getSummary };
