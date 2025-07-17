import express from "express";
import { Request, Response, RequestHandler } from "express";
import Student from "../models/studentModel";
import mongoose from "mongoose";
import { MyStudent } from "../../Types/studentTypes";


// Create a new student (POST)
export const createStudent: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // GET request body
        const studentData: MyStudent = req.body;
        
        // Validation
        if (!studentData.firstName || !studentData.lastName || !studentData.email || !studentData.studentId) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: firstName, lastName, email, and studentId are required'
            });
            return;
        }
        
        // Create student
        const newStudent = await Student.create(studentData);
        
        // Return the created new student
        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: newStudent
        });
    } catch (error: any) {
        console.error("Error creating student:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Student with this ID or email already exists'
            });
            return;
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Get all students (GET)
export const getAllStudents: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { course, grade, isActive, page = 1, limit = 10 } = req.query;
        
        // Build query object
        const query: any = {};
        if (course) query.course = course as string;
        if (grade) query.grade = grade as string;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        
        // Pagination
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const skip = (pageNumber - 1) * limitNumber;
        
        // Fetch students with pagination
        const students = await Student.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
            
        const total = await Student.countDocuments(query);
        
        res.status(200).json({
            success: true,
            message: 'Students retrieved successfully',
            data: students,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                totalStudents: total,
                hasNext: pageNumber * limitNumber < total,
                hasPrev: pageNumber > 1
            }
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get single student by MongoDB ID (GET)
export const getStudentById: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid student ID format'
            });
            return;
        }
        
        const student = await Student.findById(id);
        
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: 'Student retrieved successfully',
            data: student
        });
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get student by custom studentId (GET)
export const getStudentByStudentId: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { studentId } = req.params;
        
        if (!studentId || studentId.trim() === '') {
            res.status(400).json({
                success: false,
                message: "Student ID is required"
            });
            return;
        }
        
        const student = await Student.findOne({ studentId: studentId.trim() });
        
        if (!student) {
            res.status(404).json({
                success: false,
                message: "Student not found"
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student
        });
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update student by ID (PUT)
export const updateStudent: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData: Partial<MyStudent> = req.body;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid student ID format"
            });
            return;
        }
        
        // Check if student exists
        const existingStudent = await Student.findById(id);
        if (!existingStudent) {
            res.status(404).json({
                success: false,
                message: "Student not found"
            });
            return;
        }
        
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error: any) {
        console.error("Error updating student:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors
            });
            return;
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: "Student with this ID or email already exists"
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete student by ID (DELETE)
export const deleteStudent: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid student ID format"
            });
            return;
        }
        
        const deletedStudent = await Student.findByIdAndDelete(id);
        
        if (!deletedStudent) {
            res.status(404).json({
                success: false,
                message: 'Student not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent
        });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Soft delete student (PATCH)
export const softDeleteStudent: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid student ID format"
            });
            return;
        }
        
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
        
        if (!updatedStudent) {
            res.status(404).json({
                success: false,
                message: "Student not found"
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: "Student deactivated successfully",
            data: updatedStudent
        });
    } catch (error) {
        console.error("Error deactivating student:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Restore student (PATCH)
export const restoreStudent: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid student ID format"
            });
            return;
        }
        
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );
        
        if (!updatedStudent) {
            res.status(404).json({
                success: false,
                message: "Student not found"
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            message: "Student restored successfully",
            data: updatedStudent
        });
    } catch (error) {
        console.error("Error restoring student:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Search students (GET)
export const searchStudents: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        
        if (!query || typeof query !== 'string' || query.trim() === '') {
            res.status(400).json({
                success: false,
                message: "Search query is required"
            });
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
        
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const skip = (pageNumber - 1) * limitNumber;
        
        const students = await Student.find(searchQuery)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
            
        const total = await Student.countDocuments(searchQuery);
        
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
    } catch (error) {
        console.error("Error searching students:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};