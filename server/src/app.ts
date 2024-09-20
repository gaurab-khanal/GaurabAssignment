import express, { Application, NextFunction, Response, Request } from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import "dotenv/config";
import { limiter } from './utils/rateLimit';

const app: Application = express();
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());
app.use(limiter);

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Hello World');
}
);


// route imports
import userRouter from "./routes/user.routes";
import { ZodError } from 'zod';
import { formatZodError } from './utils/FormatZodError';
import { ApiError } from './utils/ApiError';




// route declarations
app.use("/api/v1/auth", userRouter);


// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {

        const formattedError = formatZodError(err);
        return res.status(422).json({
            success: formattedError.success,
            message: formattedError.message,
            errors: formattedError.errors,
            data: formattedError.data,
        });
    }
    else if (err instanceof ApiError) {

        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }
});

export default app;