const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || age === undefined) {
      return res.status(400).json({ message: "name and age are required" });
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge) || numericAge < 1) {
      return res.status(400).json({ message: "age must be a positive integer" });
    }

    const student = await Student.create({
      name,
      age: numericAge,
      parentId: req.user._id,
    });

    return res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create student", error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ parentId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
};
