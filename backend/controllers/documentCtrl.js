const asyncHandler = require("express-async-handler");
const Document = require("../model/Document");

const documentController = {
  // Upload document
  upload: asyncHandler(async (req, res) => {
    const { title, description, fileUrl, fileType, fileSize } = req.body;

    const document = await Document.create({
      user: req.user.id,
      title,
      description,
      fileUrl,
      fileType,
      fileSize,
      uploadDate: Date.now()
    });

    res.status(201).json({
      status: "success",
      data: document,
    });
  }),

  // Get all documents for a user
  getAll: asyncHandler(async (req, res) => {
    const documents = await Document.find({ user: req.user.id })
      .sort({ uploadDate: -1 });

    // Get storage statistics
    const stats = await Document.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$fileType",
          count: { $sum: 1 },
          totalSize: { $sum: "$fileSize" }
        }
      }
    ]);

    res.json({
      status: "success",
      data: {
        documents,
        stats: {
          totalFiles: documents.length,
          totalSize: stats.reduce((acc, stat) => acc + stat.totalSize, 0),
          byType: stats.reduce((acc, stat) => {
            acc[stat._id] = {
              count: stat.count,
              size: stat.totalSize
            };
            return acc;
          }, {})
        }
      }
    });
  }),

  // Get single document
  getOne: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      user: req.user.id
    });

    if (!document) {
      res.status(404);
      throw new Error("Document not found");
    }

    res.json({
      status: "success",
      data: document,
    });
  }),

  // Update document
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const document = await Document.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description },
      { new: true, runValidators: true }
    );

    if (!document) {
      res.status(404);
      throw new Error("Document not found");
    }

    res.json({
      status: "success",
      data: document,
    });
  }),

  // Delete document
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const document = await Document.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!document) {
      res.status(404);
      throw new Error("Document not found");
    }

    // Here you would also delete the actual file from storage
    // Implementation depends on your storage solution (e.g., S3, local filesystem)

    res.json({
      status: "success",
      data: document,
    });
  }),
};

module.exports = documentController;
