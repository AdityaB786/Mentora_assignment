const express = require("express");

const { createSession } = require("../controllers/sessionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("mentor"), createSession);

module.exports = router;
