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
import {
  validateStudent,
  validateStudentUpdate,
  validateSearch,
  validateGetAllStudents,
  validateObjectId,
  validateStudentIdParam
} from "../middleware/studentMiddleware";

const router: Router = express.Router();

// GET routes - Order matters! More specific routes should come first
router.get("/search", validateSearch, searchStudents);
router.get("/student-id/:studentId", validateStudentIdParam, getStudentByStudentId);
router.get("/", validateGetAllStudents, getAllStudents);
router.get("/:id", validateObjectId, getStudentById);

// POST routes
router.post("/", validateStudent, createStudent);

// PUT routes
router.put("/:id", validateObjectId, validateStudentUpdate, updateStudent);

// DELETE routes
router.delete("/:id", validateObjectId, deleteStudent);

// PATCH routes for soft delete/restore
router.patch("/:id/deactivate", validateObjectId, softDeleteStudent);
router.patch("/:id/restore", validateObjectId, restoreStudent);

export default router;