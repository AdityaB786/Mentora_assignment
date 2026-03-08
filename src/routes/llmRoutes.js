const express = require("express");

const { summarizeText } = require("../controllers/llmController");
const { summarizeLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/summarize", summarizeLimiter, summarizeText);

module.exports = router;
