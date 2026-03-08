const mongoose = require("mongoose");

const Lesson = require("../models/Lesson");
const Session = require("../models/Session");

const createSession = async (req, res) => {
  try {
    const { lessonId, date, topic, summary } = req.body;

    if (!lessonId || !date || !topic || !summary) {
      return res.status(400).json({ message: "lessonId, date, topic, and summary are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "lessonId must be a valid MongoDB ObjectId" });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "date must be a valid ISO-8601 date string" });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (String(lesson.mentorId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only create sessions for your own lessons" });
    }

    const session = await Session.create({
      lessonId,
      date: parsedDate,
      topic,
      summary,
    });

    return res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create session", error: error.message });
  }
};

module.exports = {
  createSession,
};
