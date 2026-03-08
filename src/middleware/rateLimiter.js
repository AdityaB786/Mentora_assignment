const rateLimit = require("express-rate-limit");

const summarizeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many summarize requests from this IP, please try again later",
  },
});

module.exports = {
  summarizeLimiter,
};
