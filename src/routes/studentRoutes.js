const express = require("express");

const { createStudent, getStudents } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("parent"), createStudent);
router.get("/", authMiddleware, roleMiddleware("parent"), getStudents);

module.exports = router;
