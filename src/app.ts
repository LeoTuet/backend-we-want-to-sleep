import compression from 'compression';
import express, {Request, Response, NextFunction} from 'express';
import baseRouter from './routes';
import {isHttpError} from "http-errors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('trust proxy', 1) // so we don't block nginx reverse proxy

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the rate limiting to all requests
app.use(limiter);

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the rate limiting to admin login requests
app.use("/admin/login", adminLoginLimiter);

app.use(baseRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!isHttpError(err)) {
    return next(err)
  }
  return res.status(err.status).json({
    error: err.message,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err)
  return res.status(500).json({
    error: err,
  });
});

export default app;