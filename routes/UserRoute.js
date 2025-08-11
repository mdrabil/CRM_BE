import express from 'express';


import { deleteUser, forgotPassword, getAllUsers, getUserById, resetPassword, updateUser } from '../controller/UserControll.js';

const router = express.Router();




router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
