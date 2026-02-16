// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import jobRoutes from './routes/job.route.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';


// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://job-board-eta-rosy.vercel.app'],
        credentials: true,
    }),
);
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); 
// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
