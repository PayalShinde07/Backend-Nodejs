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
// GET routes
router.get("/students", studentControllers_1.getAllStudents); // ?page=&limit=&course=
router.get("/students/search", studentControllers_1.searchStudents); // ?query=&page=&limit=
router.get("/students/id/:id", studentControllers_1.getStudentById); // Get by MongoDB _id
router.get("/students/studentId/:studentId", studentControllers_1.getStudentByStudentId); // Get by custom studentId
// POST route
router.post("/students", authMiddleware_1.requireAdmin, studentControllers_1.createStudent);
// PUT route
router.put("/students/:id", authMiddleware_1.requireAdmin, studentControllers_1.updateStudent);
// DELETE route
router.delete("/students/:id", authMiddleware_1.requireAdmin, studentControllers_1.deleteStudent);
// PATCH routes
router.patch("/students/:id/deactivate", authMiddleware_1.requireAdmin, studentControllers_1.softDeleteStudent);
router.patch("/students/:id/restore", authMiddleware_1.requireAdmin, studentControllers_1.restoreStudent);
exports.default = router;
