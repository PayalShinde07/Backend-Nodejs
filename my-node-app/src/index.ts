//  Import express and dotenv
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import studentRoute from './routes/studentRoute';
import cors from 'cors';

//  Load .env file variables
dotenv.config();

//  Create an Express app instance
const app = express();

app.use(
  cors({
    origin: ["exp://192.168.1.19:8081", "http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

//  Connect to MongoDB
connectDB();

//  Define the port (from .env or fallback to 5000)
const PORT: number = parseInt(process.env.PORT || '5000');

//  Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//  Define a simple health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Student routes (now protected)
app.use('/api/students', studentRoute);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`   Server is running at http://localhost:${PORT}`);
  console.log(`   API Documentation:`);
  console.log(`   - Health Check: GET http://localhost:${PORT}/health`);
  console.log(`   - Auth Routes: POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   - Auth Routes: POST http://localhost:${PORT}/api/auth/signin`);
  console.log(`   - Student Routes: GET http://localhost:${PORT}/api/students/getAllStudents`);
});