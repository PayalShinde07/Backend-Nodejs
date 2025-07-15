import { Express } from "express";
import { Request, Response, RequestHandler } from "express";
import Student_Info from "../models/studentModel";
import mongoose, { Double } from "mongoose";
interface Student  {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  grade: string;
  course: string;
  phoneNumber: string;
  enrollmentNumber: Number;
  address: object;
  subjects: Array<string>;
  cgpa: Double;
  isActive: boolean;
}
//Create a new student
export const createStudent: RequestHandler = async (
    req: Request, 
    res: Response
) => {
  try {
    //Get request body
    const studentData :  Student = req.body;

    //Create student
    const newStudent = await Student_Info.create(studentData);

    //return created student
    res.status(201).json(newStudent);
  } catch (error:any) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get all students
export const getAllStudents: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { course } = req.params;

        const students = await Student_Info.find(course ? { course } : {});

        if (!students) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

//Get student by id
export const getStudentById: RequestHandler = async (
    req: Request,
    res: Response
) : Promise<void> => {
    try {
        const { id } = req.params;

        const students = await Student_Info.findById(id);

        if (!students) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.status(200).json(students);          
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

// Get student by studentId (custom field)
export const getStudentByStudentId: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { studentId } = req.params;

    const student = await Student_Info.findOne({ studentId });

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      data: student
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update student by ID
export const updateStudent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<Student> = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    // Check if student exists
    const existingStudent = await Student_Info.findById(id);
    if (!existingStudent) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    // If updating studentId or email, check for duplicates
    if (updateData.studentId || updateData.email) {
      const duplicateQuery: any = { _id: { $ne: id } };
      
      if (updateData.studentId && updateData.studentId !== existingStudent.studentId) {
        duplicateQuery.studentId = updateData.studentId;
      }
      
      if (updateData.email && updateData.email !== existingStudent.email) {
        duplicateQuery.email = updateData.email;
      }

      const duplicateStudent = await Student_Info.findOne(duplicateQuery);
      if (duplicateStudent) {
        res.status(400).json({ 
          message: "Student with this ID or email already exists" 
        });
        return;
      }
    }

    // Update student
    const updatedStudent = await Student_Info.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent
    });
  } catch (error: any) {
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
};

// Delete student by ID
export const deleteStudent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    // Find and delete student
    const deletedStudent = await Student_Info.findByIdAndDelete(id);

    if (!deletedStudent) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({
      message: "Student deleted successfully",
      data: deletedStudent
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Soft delete student (set isActive to false)
export const softDeleteStudent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    // Update student to set isActive to false
    const updatedStudent = await Student_Info.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!updatedStudent) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({
      message: "Student deactivated successfully",
      data: updatedStudent
    });
  } catch (error) {
    console.error("Error deactivating student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Restore student (set isActive to true)
export const restoreStudent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid student ID format" });
      return;
    }

    // Update student to set isActive to true
    const updatedStudent = await Student_Info.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!updatedStudent) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({
      message: "Student restored successfully",
      data: updatedStudent
    });
  } catch (error) {
    console.error("Error restoring student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search students
export const searchStudents: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const students = await Student_Info.find(searchQuery)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Student_Info.countDocuments(searchQuery);

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
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
