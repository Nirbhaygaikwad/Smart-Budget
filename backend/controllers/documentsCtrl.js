const Document = require('../models/Document');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Upload a document
// @route   POST /api/v1/documents
// @access  Private
exports.uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const document = await Document.create({
        user: req.user._id,
        name: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
    });

    res.status(201).json(document);
});

// @desc    Get all documents for a user
// @route   GET /api/v1/documents
// @access  Private
exports.getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find({ user: req.user._id });
    res.json(documents);
});

// @desc    Download a document
// @route   GET /api/v1/documents/:id
// @access  Private
exports.downloadDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Make sure user owns document
    if (document.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const file = path.join(__dirname, '..', document.path);
    res.download(file, document.name);
});

// @desc    Delete a document
// @route   DELETE /api/v1/documents/:id
// @access  Private
exports.deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Make sure user owns document
    if (document.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Delete file from filesystem
    fs.unlink(document.path, async (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        }
        // Delete document from database
        await document.remove();
        res.json({ message: 'Document removed' });
    });
});
