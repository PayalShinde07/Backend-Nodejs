import express, { Router } from 'express';
import {signUp,signIn,getCurrentUser,updatePassword,signOut} from '../controllers/authControllers';
import { authenticateToken } from '../middleware/authMiddleware';

const router: Router = express.Router();

//  Public Routes
router.post('/signup', signUp);
router.post('/signin', signIn);

//  Protected Routes
router.use(authenticateToken);

router.get('/me', getCurrentUser);
router.put('/update-password', updatePassword);
router.post('/signout', signOut);

export default router;
