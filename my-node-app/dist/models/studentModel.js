"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//Define schema for student
const studentSchema = new mongoose_1.default.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    enrollmentNumber: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    subjects: {
        type: Array,
        required: true,
    },
    cgpa: {
        type: Number,
        required: true
    }
});
//Create model for stuudent
const Student_Info = mongoose_1.default.model("Student", studentSchema);
exports.default = Student_Info;
