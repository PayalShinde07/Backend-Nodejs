import express, { Router } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  searchStudents,
  getStudentByStudentId,
  updateStudent,
  deleteStudent,
  softDeleteStudent,
  restoreStudent
} from "../controllers/studentControllers";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Public routes (if you want some to be accessible without authentication)
// router.get("/getAllStudents", getAllStudents);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply authentication to all routes below

// Routes accessible by authenticated users
router.get("/getAllStudents", getAllStudents);
router.get("/search", searchStudents);
router.get("/studentId/:studentId", getStudentByStudentId);
router.get("/:id", getStudentById);

// Routes that require admin privileges
router.post("/createStudent", requireAdmin, createStudent);
router.put("/:id", requireAdmin, updateStudent);
router.delete("/:id", requireAdmin, deleteStudent);
router.patch("/:id/deactivate", requireAdmin, softDeleteStudent);
router.patch("/:id/restore", requireAdmin, restoreStudent);

export default router;