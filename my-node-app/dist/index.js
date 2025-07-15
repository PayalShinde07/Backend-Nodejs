"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//  Import express and dotenv
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
// import productRoute from './routes/productRoute';
const studentRoute_1 = __importDefault(require("./routes/studentRoute"));
const cors_1 = __importDefault(require("cors"));
//  Load .env file variables
dotenv_1.default.config();
//  Create an Express app instance
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "exp://192.168.1.19:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));
//  Connect to MongoDB
(0, database_1.default)();
//  Define the port (from .env or fallback to 3000)
const PORT = parseInt(process.env.PORT || '5000');
//  Middleware to parse JSON
app.use(express_1.default.json());
//  Define a simple health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
// // Use the product routes
// app.use('/api/Product', productRoute);
// Use the student routes
app.use('/api/students', studentRoute_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
