import express, { Application, NextFunction, Response, Request } from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import "dotenv/config";

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


app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Hello World');
}
);


export default app;