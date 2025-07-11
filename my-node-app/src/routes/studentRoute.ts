import express,{ Router } from "express";
import { createStudent,getAllStudents,getStudentById} from "../controllers/studentControllers";

const router: Router = express.Router();

//Add new student
router.post("/createStudent", createStudent);

//Get all students
router.get("/getAllStudents", getAllStudents);

//Get student by id
router.get("/:id", getStudentById);



export default router;