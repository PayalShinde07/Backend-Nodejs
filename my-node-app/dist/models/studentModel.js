"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    age: {
        type: String,
        required: [true, 'Age is required']
    },
    grade: {
        type: String,
        required: [true, 'Grade is required']
    },
    course: {
        type: String,
        required: [true, 'Course is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
    },
    enrollmentNumber: {
        type: Number,
        required: [true, 'Enrollment number is required']
    },
    address: {
        type: Object,
        required: [true, 'Address is required']
    },
    subjects: {
        type: [String],
        required: [true, 'Subjects are required']
    },
    cgpa: {
        type: Number,
        required: [true, 'CGPA is required'],
        min: [0, 'CGPA cannot be negative'],
        max: [10, 'CGPA cannot exceed 10']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Student_Info = mongoose_1.default.model("Student", studentSchema);
exports.default = Student_Info;
