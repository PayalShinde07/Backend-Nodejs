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


//Define schema for student
const studentSchema = new mongoose.Schema({
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
const Student_Info = mongoose.model<Student>("Student", studentSchema);
export default Student_Info;