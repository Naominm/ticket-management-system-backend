import { Router } from 'express';
import { Login } from '../controllers/authController.js';

console.log('Hello from routes');

const router = Router();

router.post('/login', Login);

export default router;
