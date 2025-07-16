import express, { Router } from "express";
import {createStudent,getAllStudents,getStudentById,searchStudents,getStudentByStudentId,updateStudent,deleteStudent,softDeleteStudent,restoreStudent} from "../controllers/studentControllers";
import {
  authenticateToken,
  requireAdmin
} from "../middleware/authMiddleware";

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET routes
router.get("/students", getAllStudents);                             // ?page=&limit=&course=
router.get("/students/search", searchStudents);                      // ?query=&page=&limit=
router.get("/students/id/:id", getStudentById);                      // Get by MongoDB _id
router.get("/students/studentId/:studentId", getStudentByStudentId); // Get by custom studentId

// POST route
router.post("/students", requireAdmin, createStudent);

// PUT route
router.put("/students/:id", requireAdmin, updateStudent);

// DELETE route
router.delete("/students/:id", requireAdmin, deleteStudent);

// PATCH routes
router.patch("/students/:id/deactivate", requireAdmin, softDeleteStudent);
router.patch("/students/:id/restore", requireAdmin, restoreStudent);

export default router;
