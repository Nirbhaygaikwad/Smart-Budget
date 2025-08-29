import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../Shared/DashboardLayout';
import './Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    try {
      const currentUser = localStorage.getItem('user');
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const userDocsKey = `documents_${JSON.parse(currentUser).id}`;
      const storedDocs = localStorage.getItem(userDocsKey);
      
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Error loading documents');
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      toast.error('Please log in to upload documents');
      return;
    }

    try {
      const newDocs = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        const base64 = await convertToBase64(file);
        const doc = {
          id: Date.now() + i,
          name: file.name,
          type: file.type,
          size: file.size,
          content: base64,
          uploadDate: new Date().toISOString()
        };
        newDocs.push(doc);
      }

      const updatedDocs = [...documents, ...newDocs];
      setDocuments(updatedDocs);

      const userDocsKey = `documents_${currentUser.id}`;
      localStorage.setItem(userDocsKey, JSON.stringify(updatedDocs));

      toast.success('Documents uploaded successfully');
      e.target.value = null; // Reset file input
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Error uploading documents');
    }
  };

  const handleDelete = (docId) => {
    try {
      const updatedDocs = documents.filter(doc => doc.id !== docId);
      setDocuments(updatedDocs);

      const currentUser = JSON.parse(localStorage.getItem('user'));
      const userDocsKey = `documents_${currentUser.id}`;
      localStorage.setItem(userDocsKey, JSON.stringify(updatedDocs));

      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const handleView = (doc) => {
    try {
      const linkSource = doc.content;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = doc.name;
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
              Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX, JPG, JPEG, PNG (Max 5MB)
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
                  <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>{doc.type}</td>
                    <td>{formatFileSize(doc.size)}</td>
                    <td>{formatDate(doc.uploadDate)}</td>
                    <td>
                      <button
                        onClick={() => handleView(doc)}
                        className="view-btn"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
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
