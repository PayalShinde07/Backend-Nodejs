import { Express } from "express";
import { Request, Response, RequestHandler } from "express";
import Student_Info from "../models/studentModel";
import { Double } from "mongoose";
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
        const { course, isActive } = req.query;

        const query: any = {};

        if (course) {
            query.course = course;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const Students = await Student_Info.find(query);

        res.status(200).json(Students);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

//Get student by id
export const getStudentById: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { id, isActive } = req.query;

        const query: any = {};

        if (typeof id === 'string' && id.trim() !== '') {
            query.id = id;
        }

        if (isActive !== undefined) {
            query.inStock = isActive === 'true';
        }

        const Students = await Student_Info.find(query);

        res.status(200).json(Students);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

