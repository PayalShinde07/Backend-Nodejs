"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const router = express_1.default.Router();
// GET routes - Order matters! More specific routes should come first
router.get("/search", studentControllers_1.searchStudents); // Search students: ?query=searchTerm&page=1&limit=10
router.get("/student-id/:studentId", studentControllers_1.getStudentByStudentId); // Get by custom studentId
router.get("/active", studentControllers_1.getAllStudents); // Get all active students (with filters)
router.get("/", studentControllers_1.getAllStudents); // Get all students: ?page=1&limit=10&course=CS&grade=A
router.get("/:id", studentControllers_1.getStudentById); // Get by MongoDB _id
// POST routes
router.post("/", studentControllers_1.createStudent);
// PUT routes
router.put("/:id", studentControllers_1.updateStudent);
// DELETE routes
router.delete("/:id", studentControllers_1.deleteStudent);
// PATCH routes for soft delete/restore
router.patch("/:id/deactivate", studentControllers_1.softDeleteStudent);
router.patch("/:id/restore", studentControllers_1.restoreStudent);
exports.default = router;
