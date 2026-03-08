const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Lesson = require("../models/Lesson");
const Student = require("../models/Student");

const createBooking = async (req, res) => {
  try {
    const { studentId, lessonId } = req.body;

    if (!studentId || !lessonId) {
      return res.status(400).json({ message: "studentId and lessonId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "studentId and lessonId must be valid MongoDB ObjectIds" });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (String(student.parentId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only book lessons for your own students" });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const booking = await Booking.create({
      studentId,
      lessonId,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This student is already booked into the lesson" });
    }

    return res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

module.exports = {
  createBooking,
};
