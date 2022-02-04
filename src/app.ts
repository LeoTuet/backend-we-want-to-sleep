import compression from 'compression';
import express, {Request, Response, NextFunction} from 'express';
import baseRouter from './routes';

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(baseRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).json({
        error: err,
    });
});

export default app;