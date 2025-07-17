"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(authMiddleware_1.authenticateToken);
// GET routes - Order matters! More specific routes should come first
router.get("/search", studentControllers_1.searchStudents); // ?query=&page=&limit=
router.get("/student-id/:studentId", studentControllers_1.getStudentByStudentId); // Get by custom studentId
router.get("/", studentControllers_1.getAllStudents); // ?page=&limit=&course=
router.get("/:id", studentControllers_1.getStudentById); // Get by MongoDB _id
// POST route
router.post("/", authMiddleware_1.requireAdmin, studentControllers_1.createStudent);
// PUT route
router.put("/:id", authMiddleware_1.requireAdmin, studentControllers_1.updateStudent);
// DELETE route
router.delete("/:id", authMiddleware_1.requireAdmin, studentControllers_1.deleteStudent);
// PATCH routes
router.patch("/:id/deactivate", authMiddleware_1.requireAdmin, studentControllers_1.softDeleteStudent);
router.patch("/:id/restore", authMiddleware_1.requireAdmin, studentControllers_1.restoreStudent);
exports.default = router;
