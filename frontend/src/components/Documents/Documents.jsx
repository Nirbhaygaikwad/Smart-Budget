import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../Shared/DashboardLayout';
import { getDocuments, getDocument, uploadDocument, deleteDocument } from '../../services/documents/documentService';
import './Documents.css';

// Uploads are sent as base64 (about 4/3 of the file size) and Vercel limits request bodies to 4.5MB
const MAX_FILE_SIZE = 3 * 1024 * 1024;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setDocuments(await getDocuments());
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Error loading documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const input = e.target;
    const files = Array.from(input.files);
    if (!files.length) return;

    let uploaded = 0;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 3MB`);
        continue;
      }

      try {
        const content = await convertToBase64(file);
        const doc = await uploadDocument({ name: file.name, type: file.type, size: file.size, content });
        setDocuments(prev => [doc, ...prev]);
        uploaded++;
      } catch (error) {
        console.error('Error uploading document:', error);
        toast.error(error.response?.data?.message || `Error uploading ${file.name}`);
      }
    }

    if (uploaded) toast.success('Documents uploaded successfully');
    input.value = null; // Reset file input
  };

  const handleDelete = async (docId) => {
    try {
      await deleteDocument(docId);
      setDocuments(documents.filter(doc => doc._id !== docId));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleView = async (doc) => {
    try {
      const { fileUrl, title } = await getDocument(doc._id);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileUrl;
      downloadLink.download = title;
      downloadLink.click();
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Error viewing document');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="documents-page">
        <div className="documents-header">
          <h2>Documents</h2>
          <div className="upload-section">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.jpg,.jpeg,.png"
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-button">
              Upload Documents
            </label>
            <p className="upload-info">
              Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX, JPG, JPEG, PNG (Max 3MB)
            </p>
          </div>
        </div>

        <div className="documents-list">
          {loading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="no-documents">No documents uploaded yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc._id}>
                    <td>{doc.title}</td>
                    <td>{doc.fileType}</td>
                    <td>{formatFileSize(doc.fileSize)}</td>
                    <td>{formatDate(doc.uploadDate)}</td>
                    <td>
                      <button
                        onClick={() => handleView(doc)}
                        className="view-btn"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
