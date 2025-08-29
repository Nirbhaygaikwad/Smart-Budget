const Document = require('../model/Document');

// Add a document
exports.addDocument = async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    const document = new Document({
      title,
      fileUrl,
      user: req.userId, // Assuming you have user authentication middleware to get userId
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error adding document', error });
  }
};

// Get all documents of the logged-in user
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.userId });
    res.status(200).json(documents);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching documents', error });
  }
};

// Delete a document by ID
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting document', error });
  }
};
