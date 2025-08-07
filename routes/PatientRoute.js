import express from 'express';
import { createPatient, deletePatient, getAllPatients, getPatient, getTodaysPatients, searchQueryPatient, updatePatient } from '../controller/CreatePatient.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/', searchQueryPatient);
router.get('/today', getTodaysPatients); // 👈 New API route

router.get('/:id', getPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
