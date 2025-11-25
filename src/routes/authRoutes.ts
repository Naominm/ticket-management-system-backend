import { Router } from 'express';
import { Signup, Login } from '../controllers/authController.js';

console.log('Hello from routes');

const router = Router();

router.post('/signup', Signup);
router.post('/login', Login);

export default router;
