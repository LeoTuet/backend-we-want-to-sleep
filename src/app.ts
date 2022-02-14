import compression from 'compression';
import express, {Request, Response, NextFunction} from 'express';
import baseRouter from './routes';
import {isHttpError} from "http-errors";

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('trust proxy', 1) // so we don't block nginx reverse proxy

app.use(baseRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!isHttpError(err)) {
    return next(err)
  }
  return res.status(err.status).json({
    error: {
      "timestamp": new Date(),
      "status": err.statusCode,
      "error": err.name,
      "message": err.message
    },
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err)
  return res.status(500).json({
    error: {
      "timestamp": new Date(),
      "status": 500,
      "error": "InternalServerError",
      "message": "Undefined hehe"
    },
  });
});

export default app;