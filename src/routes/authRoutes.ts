import { Router } from 'express';
import { Signup } from '../controllers/authController.js';

console.log('Hello from routes');

const router = Router();

router.post('/signup', Signup);

export default router;
