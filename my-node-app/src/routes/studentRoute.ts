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
import {
  authenticateToken,
  requireAdmin
} from "../middleware/authMiddleware";

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET routes - Order matters! More specific routes should come first
router.get("/search", searchStudents);                      // ?query=&page=&limit=
router.get("/student-id/:studentId", getStudentByStudentId); // Get by custom studentId
router.get("/", getAllStudents);                            // ?page=&limit=&course=
router.get("/:id", getStudentById);                         // Get by MongoDB _id

// POST route
router.post("/", requireAdmin, createStudent);

// PUT route
router.put("/:id", requireAdmin, updateStudent);

// DELETE route
router.delete("/:id", requireAdmin, deleteStudent);

// PATCH routes
router.patch("/:id/deactivate", requireAdmin, softDeleteStudent);
router.patch("/:id/restore", requireAdmin, restoreStudent);

export default router;