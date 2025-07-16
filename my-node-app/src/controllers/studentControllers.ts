import { Request, Response, RequestHandler } from "express";
import Student_Info from "../models/studentModel";
import mongoose from "mongoose";

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  grade: string;
  course: string;
  phoneNumber: string;
  enrollmentNumber: number;
  address: object;
  subjects: Array<string>;
  cgpa: number;
  isActive: boolean;
}

export const createStudent: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentData: Student = req.body;
    if (!studentData.studentId || !studentData.firstName || !studentData.lastName || !studentData.email) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }
    const newStudent = await Student_Info.create(studentData);
    res.status(201).json({ success: true, message: "Student created successfully", data: newStudent });
  } catch (error: any) {
    console.error("Error creating student:", error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "Student with this ID or email already exists" });
      return;
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllStudents: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { course, page = 1, limit = 10 } = req.query;
    const query: any = {};
    if (course) query.course = course as string;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const students = await Student_Info.find(query).skip(skip).limit(limitNumber).sort({ createdAt: -1 });
    const total = await Student_Info.countDocuments(query);

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
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getStudentById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid student ID format' });
      return;
    }
    const student = await Student_Info.findById(id);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }
    res.status(200).json({ success: true, message: "Student retrieved successfully", data: student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getStudentByStudentId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    if (!studentId || studentId.trim() === '') {
      res.status(400).json({ success: false, message: "Student ID is required" });
      return;
    }
    const student = await Student_Info.findOne({ studentId: studentId.trim() });
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Student retrieved successfully", data: student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateStudent: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<Student> = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student ID format" });
      return;
    }
    const existingStudent = await Student_Info.findById(id);
    if (!existingStudent) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }
    const updatedStudent = await Student_Info.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Student updated successfully", data: updatedStudent });
  } catch (error: any) {
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
};

export const deleteStudent: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student ID format" });
      return;
    }
    const deletedStudent = await Student_Info.findByIdAndDelete(id);
    if (!deletedStudent) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Student deleted successfully", data: deletedStudent });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const softDeleteStudent: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student ID format" });
      return;
    }
    const updatedStudent = await Student_Info.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!updatedStudent) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Student deactivated successfully", data: updatedStudent });
  } catch (error) {
    console.error("Error deactivating student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const restoreStudent: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid student ID format" });
      return;
    }
    const updatedStudent = await Student_Info.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!updatedStudent) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Student restored successfully", data: updatedStudent });
  } catch (error) {
    console.error("Error restoring student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchStudents: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const students = await Student_Info.find(searchQuery).skip(skip).limit(limitNumber).sort({ createdAt: -1 });
    const total = await Student_Info.countDocuments(searchQuery);

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
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
