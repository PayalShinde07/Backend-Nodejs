//  Import express and dotenv
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database';
// import productRoute from './routes/productRoute';
import studentRoute from './routes/studentRoute';
import  cors from 'cors';

//  Load .env file variables
dotenv.config();

//  Create an Express app instance
const app = express();

app.use(cors({
  origin: 'http://localhost:8081',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
 allowedHeaders: ['Content-Type', 'application/json', 'Authorization'],
}));


//  Connect to MongoDB
connectDB();

//  Define the port (from .env or fallback to 3000)
const PORT: number = parseInt(process.env.PORT || '5000');

//  Middleware to parse JSON
app.use(express.json());

//  Define a simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// // Use the product routes
// app.use('/api/Product', productRoute);

// Use the student routes
app.use('/api/Students', studentRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});