import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();

const app = express();


const PORT = process.env.PORT || 5000;

connectDB();

app.use(
    cors({
        origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173',
        credentials:true
    })
);

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message: 'Quiz API is running'});
});

app.use('/api/auth',authRoutes);
app.use('/api/quizzes',quizRoutes);
app.use('/api/results', resultRoutes);

app.use((req,res)=>{
    res.status(404).json({ message:'Route not found' })
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});