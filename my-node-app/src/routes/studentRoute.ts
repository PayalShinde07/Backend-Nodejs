import express, { Router } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByStudentId,
  updateStudent,
  deleteStudent,
  softDeleteStudent,
  restoreStudent,
  searchStudents
} from "../controllers/studentControllers";

const router: Router = express.Router();

// GET routes - Order matters! More specific routes should come first
router.get("/search", searchStudents);                      // Search students: ?query=searchTerm&page=1&limit=10
router.get("/student-id/:studentId", getStudentByStudentId); // Get by custom studentId
router.get("/active", getAllStudents);                       // Get all active students (with filters)
router.get("/", getAllStudents);                            // Get all students: ?page=1&limit=10&course=CS&grade=A
router.get("/:id", getStudentById);                         // Get by MongoDB _id

// POST routes
router.post("/", createStudent);

// PUT routes
router.put("/:id", updateStudent);

// DELETE routes
router.delete("/:id", deleteStudent);

// PATCH routes for soft delete/restore
router.patch("/:id/deactivate", softDeleteStudent);
router.patch("/:id/restore", restoreStudent);

export default router;
