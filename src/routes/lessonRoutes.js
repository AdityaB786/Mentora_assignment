const express = require("express");

const { createLesson, getSessionsByLesson } = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/lessons", authMiddleware, roleMiddleware("mentor"), createLesson);
router.get("/lessons/:id/sessions", authMiddleware, getSessionsByLesson);

module.exports = router;
