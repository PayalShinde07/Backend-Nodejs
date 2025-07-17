//  Import express and dotenv
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database';
import studentRoutes from './routes/studentRoute';
import cors from 'cors';

//  Load .env file variables
dotenv.config();

//  Create an Express app instance
const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: "exp://192.168.106.175:8081",
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type','Accept'],
  })
);


//  Connect to MongoDB
connectDB();
  
//  Define the port (from .env or fallback to 3000)
const PORT: number = parseInt(process.env.PORT || '3000');
 
//  Middleware to parse JSON
app.use(express.json());


//  Define a simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


// Use the student routes
app.use('/api/students', studentRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});