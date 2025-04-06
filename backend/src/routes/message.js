const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get("/users", protectRoute, messageController.getUsersForSidebar);

router.get("/:id", protectRoute, messageController.getMessages);

router.post("/send/:id", protectRoute, messageController.postSendMessage);

module.exports = router;