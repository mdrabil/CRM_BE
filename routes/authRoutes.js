import express from 'express';
import { login, register, updatePassword } from '../controller/authController.js';
import checkWifiAccess from '../middleware/checkWifiAccess.js';

const router = express.Router();

router.post('/register', register); // First time admin
router.post("/login", checkWifiAccess, login);
router.put('/update', updatePassword);

export default router;




// router.post('/login', login);