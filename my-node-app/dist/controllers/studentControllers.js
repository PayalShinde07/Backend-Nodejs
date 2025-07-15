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
//Create a new student
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get request body
        const studentData = req.body;
        //Create student
        const newStudent = yield studentModel_1.default.create(studentData);
        //return created student
        res.status(201).json(newStudent);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createStudent = createStudent;
//Get all students
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course } = req.params;
        const students = yield studentModel_1.default.find(course ? { course } : {});
        if (!students) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.status(200).json(students);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
});
exports.getAllStudents = getAllStudents;
//Get student by id
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const students = yield studentModel_1.default.findById(id);
        if (!students) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.status(200).json(students);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
});
exports.getStudentById = getStudentById;
// Get student by studentId (custom field)
const getStudentByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const student = yield studentModel_1.default.findOne({ studentId });
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(200).json({
            message: "Student retrieved successfully",
            data: student
        });
    }
    catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getStudentByStudentId = getStudentByStudentId;
// Update student by ID
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid student ID format" });
            return;
        }
        // Check if student exists
        const existingStudent = yield studentModel_1.default.findById(id);
        if (!existingStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        // If updating studentId or email, check for duplicates
        if (updateData.studentId || updateData.email) {
            const duplicateQuery = { _id: { $ne: id } };
            if (updateData.studentId && updateData.studentId !== existingStudent.studentId) {
                duplicateQuery.studentId = updateData.studentId;
            }
            if (updateData.email && updateData.email !== existingStudent.email) {
                duplicateQuery.email = updateData.email;
            }
            const duplicateStudent = yield studentModel_1.default.findOne(duplicateQuery);
            if (duplicateStudent) {
                res.status(400).json({
                    message: "Student with this ID or email already exists"
                });
                return;
            }
        }
        // Update student
        const updatedStudent = yield studentModel_1.default.findByIdAndUpdate(id, updateData, {
            new: true, // Return updated document
            runValidators: true // Run schema validators
        });
        res.status(200).json({
            message: "Student updated successfully",
            data: updatedStudent
        });
    }
    catch (error) {
        console.error("Error updating student:", error);
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
            return;
        }
        // Handle duplicate key error
        if (error.code === 11000) {
            res.status(400).json({
                message: "Student with this ID or email already exists"
            });
            return;
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateStudent = updateStudent;
// Delete student by ID
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid student ID format" });
            return;
        }
        // Find and delete student
        const deletedStudent = yield studentModel_1.default.findByIdAndDelete(id);
        if (!deletedStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(200).json({
            message: "Student deleted successfully",
            data: deletedStudent
        });
    }
    catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteStudent = deleteStudent;
// Soft delete student (set isActive to false)
const softDeleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid student ID format" });
            return;
        }
        // Update student to set isActive to false
        const updatedStudent = yield studentModel_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!updatedStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(200).json({
            message: "Student deactivated successfully",
            data: updatedStudent
        });
    }
    catch (error) {
        console.error("Error deactivating student:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.softDeleteStudent = softDeleteStudent;
// Restore student (set isActive to true)
const restoreStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid student ID format" });
            return;
        }
        // Update student to set isActive to true
        const updatedStudent = yield studentModel_1.default.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!updatedStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        res.status(200).json({
            message: "Student restored successfully",
            data: updatedStudent
        });
    }
    catch (error) {
        console.error("Error restoring student:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.restoreStudent = restoreStudent;
// Search students
const searchStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        if (!query) {
            res.status(400).json({ message: "Search query is required" });
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
        const students = yield studentModel_1.default.find(searchQuery)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        const total = yield studentModel_1.default.countDocuments(searchQuery);
        res.status(200).json({
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
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.searchStudents = searchStudents;
