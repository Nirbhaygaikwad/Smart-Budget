import axiosInstance from '../axiosInstance';

// Upload document (file content is sent as a base64 data URL)
export const uploadDocument = async ({ name, type, size, content }) => {
  const response = await axiosInstance.post('/documents', {
    title: name,
    description: name,
    fileUrl: content,
    fileType: type || 'application/octet-stream',
    fileSize: size
  });
  return response.data.data;
};

// Get user's documents (without file contents)
export const getDocuments = async () => {
  const response = await axiosInstance.get('/documents');
  return response.data.data.documents;
};

// Get a single document including its file contents
export const getDocument = async (documentId) => {
  const response = await axiosInstance.get(`/documents/${documentId}`);
  return response.data.data;
};

// Delete document
export const deleteDocument = async (documentId) => {
  const response = await axiosInstance.delete(`/documents/${documentId}`);
  return response.data.data;
};
