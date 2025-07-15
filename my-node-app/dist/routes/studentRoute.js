"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const router = express_1.default.Router();
//Add new student
router.post("/createStudent", studentControllers_1.createStudent);
//Get all students
router.get("/getAllStudents", studentControllers_1.getAllStudents);
//Get student by id
router.get("/:id", studentControllers_1.getStudentById);
// Search students
router.get("/search", studentControllers_1.searchStudents);
// Get student by custom studentId field
router.get("/studentId/:studentId", studentControllers_1.getStudentByStudentId);
// Update student by ID
router.put("/:id", studentControllers_1.updateStudent);
// Delete student by ID (hard delete)
router.delete("/:id", studentControllers_1.deleteStudent);
// Soft delete student (set isActive to false)
router.patch("/:id/deactivate", studentControllers_1.softDeleteStudent);
// Restore student (set isActive to true)
router.patch("/:id/restore", studentControllers_1.restoreStudent);
exports.default = router;
