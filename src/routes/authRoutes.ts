import { Router } from 'express';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { Setup, CreateUser, GetAllUsers, Login } from '../controllers/authController.js';

console.log('Hello from routes');

const router = Router();

router.post('setup', Setup);
router.post('/login', Login);
router.post('/users', authMiddleware, CreateUser);
router.get('/users', authMiddleware, GetAllUsers);

export default router;
