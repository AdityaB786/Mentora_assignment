const mongoose = require("mongoose");

const Session = require("../models/Session");
const Lesson = require("../models/Lesson");
const Student = require("../models/Student");
const Booking = require("../models/Booking");

const createLesson = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const lesson = await Lesson.create({
      title,
      description,
      mentorId: req.user._id,
    });

    return res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create lesson", error: error.message });
  }
};

const getSessionsByLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid lesson id" });
    }

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (req.user.role === "mentor" && String(lesson.mentorId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only view sessions for your own lessons" });
    }

    if (req.user.role === "parent") {
      const students = await Student.find({ parentId: req.user._id }).select("_id");
      const studentIds = students.map((student) => student._id);

      const hasBooking = await Booking.exists({
        lessonId: lesson._id,
        studentId: { $in: studentIds },
      });

      if (!hasBooking) {
        return res.status(403).json({ message: "You do not have access to sessions for this lesson" });
      }
    }

    const sessions = await Session.find({ lessonId: lesson._id }).sort({ date: 1 });

    return res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
  }
};

module.exports = {
  createLesson,
  getSessionsByLesson,
};
