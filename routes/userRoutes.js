const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const protect = require("../middleware/auth");

// GET /api/profile — protected route
router.get("/profile", protect, getProfile);

module.exports = router;
