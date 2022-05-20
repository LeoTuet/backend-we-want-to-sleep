import rateLimit from "express-rate-limit";

const defaultMessage = {
  error: {
    timestamp: new Date(),
    status: 429,
    error: "TooManyRequests",
    message: "Too many requests, please try again later.",
  },
};

export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
});

export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: defaultMessage,
});
