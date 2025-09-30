import express from 'express';
import { login, register, updatePassword } from '../controller/authController.js';

const router = express.Router();

router.post('/register', register); // First time admin
router.post('/login', login);
router.put('/update', updatePassword);

export default router;


