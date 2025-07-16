"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStudents = exports.restoreStudent = exports.softDeleteStudent = exports.deleteStudent = exports.updateStudent = exports.getStudentByStudentId = exports.getStudentById = exports.getAllStudents = exports.createStudent = void 0;
const studentModel_1 = __importDefault(require("../models/studentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentData = req.body;
        if (!studentData.studentId || !studentData.firstName || !studentData.lastName || !studentData.email) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }
        const newStudent = yield studentModel_1.default.create(studentData);
        res.status(201).json({ success: true, message: "Student created successfully", data: newStudent });
    }
    catch (error) {
        console.error("Error creating student:", error);
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: "Student with this ID or email already exists" });
            return;
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createStudent = createStudent;
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course, page = 1, limit = 10 } = req.query;
        const query = {};
        if (course)
            query.course = course;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const students = yield studentModel_1.default.find(query).skip(skip).limit(limitNumber).sort({ createdAt: -1 });
        const total = yield studentModel_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: students,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                totalStudents: total,
                hasNext: pageNumber * limitNumber < total,
                hasPrev: pageNumber > 1
            }
        });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
});
exports.getAllStudents = getAllStudents;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid student ID format' });
            return;
        }
        const student = yield studentModel_1.default.findById(id);
        if (!student) {
            res.status(404).json({ success: false, message: 'Student not found' });
            return;
        }
        res.status(200).json({ success: true, message: "Student retrieved successfully", data: student });
    }
    catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
});
exports.getStudentById = getStudentById;
const getStudentByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        if (!studentId || studentId.trim() === '') {
            res.status(400).json({ success: false, message: "Student ID is required" });
            return;
        }
        const student = yield studentModel_1.default.findOne({ studentId: studentId.trim() });
        if (!student) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Student retrieved successfully", data: student });
    }
    catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getStudentByStudentId = getStudentByStudentId;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student ID format" });
            return;
        }
        const existingStudent = yield studentModel_1.default.findById(id);
        if (!existingStudent) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        const updatedStudent = yield studentModel_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: "Student updated successfully", data: updatedStudent });
    }
    catch (error) {
        console.error("Error updating student:", error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
            return;
        }
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: "Student with this ID or email already exists" });
            return;
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student ID format" });
            return;
        }
        const deletedStudent = yield studentModel_1.default.findByIdAndDelete(id);
        if (!deletedStudent) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Student deleted successfully", data: deletedStudent });
    }
    catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteStudent = deleteStudent;
const softDeleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student ID format" });
            return;
        }
        const updatedStudent = yield studentModel_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!updatedStudent) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Student deactivated successfully", data: updatedStudent });
    }
    catch (error) {
        console.error("Error deactivating student:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.softDeleteStudent = softDeleteStudent;
const restoreStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid student ID format" });
            return;
        }
        const updatedStudent = yield studentModel_1.default.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!updatedStudent) {
            res.status(404).json({ success: false, message: "Student not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Student restored successfully", data: updatedStudent });
    }
    catch (error) {
        console.error("Error restoring student:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.restoreStudent = restoreStudent;
const searchStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        if (!query || typeof query !== 'string' || query.trim() === '') {
            res.status(400).json({ success: false, message: "Search query is required" });
            return;
        }
        const searchQuery = {
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { studentId: { $regex: query, $options: 'i' } },
                { course: { $regex: query, $options: 'i' } },
                { grade: { $regex: query, $options: 'i' } }
            ]
        };
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const students = yield studentModel_1.default.find(searchQuery).skip(skip).limit(limitNumber).sort({ createdAt: -1 });
        const total = yield studentModel_1.default.countDocuments(searchQuery);
        res.status(200).json({
            success: true,
            message: "Search results retrieved successfully",
            data: students,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                totalStudents: total,
                hasNext: pageNumber * limitNumber < total,
                hasPrev: pageNumber > 1
            }
        });
    }
    catch (error) {
        console.error("Error searching students:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.searchStudents = searchStudents;
