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
exports.default = router;
