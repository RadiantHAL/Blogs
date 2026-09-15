import express, { Request, Response, NextFunction } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
/* require all the routes here */
import authRouter from "./routes/auth.routes"
import blogRouter from "./routes/blog.routes"
/* using all the routes here */
app.use('/api/auth', authRouter);
app.use('/api/blog',blogRouter)

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default app
