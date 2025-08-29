const express = require("express");
const documentController = require("../controllers/documentCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const documentRouter = express.Router();

// Apply authentication middleware to all routes
documentRouter.use(isAuthenticated);

// Document routes
documentRouter.post("/", documentController.upload);
documentRouter.get("/", documentController.getAll);
documentRouter.get("/:id", documentController.getOne);
documentRouter.put("/:id", documentController.update);
documentRouter.delete("/:id", documentController.delete);

module.exports = documentRouter;
