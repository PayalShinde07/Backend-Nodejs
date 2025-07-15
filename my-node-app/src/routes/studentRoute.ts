import express,{ Router } from "express";
import { createStudent, getAllStudents, getStudentById, searchStudents, getStudentByStudentId, updateStudent, deleteStudent, softDeleteStudent, restoreStudent} from "../controllers/studentControllers";

const router: Router = express.Router();

//Add new student
router.post("/createStudent", createStudent);

//Get all students
router.get("/getAllStudents", getAllStudents);

//Get student by id
router.get("/:id", getStudentById);

// Search students
router.get("/search", searchStudents);

// Get student by custom studentId field
router.get("/studentId/:studentId", getStudentByStudentId);

// Update student by ID
router.put("/:id", updateStudent);

// Delete student by ID (hard delete)
router.delete("/:id", deleteStudent);

// Soft delete student (set isActive to false)
router.patch("/:id/deactivate", softDeleteStudent);

// Restore student (set isActive to true)
router.patch("/:id/restore", restoreStudent);


export default router;