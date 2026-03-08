const express = require("express");

const { signup, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
