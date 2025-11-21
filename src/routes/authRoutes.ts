import { Router } from 'express';
import { Signup } from '../controllers/authController';

const router = Router();

router.post('/signup', Signup);
