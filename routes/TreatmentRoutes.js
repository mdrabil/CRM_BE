import express from 'express';
import { createTreatment, deleteTreatment, getAllTreatments, getTreatmentById, updateTreatment } from '../controller/TreatmentControll.js';


const router = express.Router();

router.post('/', createTreatment);
router.get('/', getAllTreatments);
router.get('/:id', getTreatmentById);
router.put('/:id', updateTreatment);
router.delete('/:id', deleteTreatment);

export default router;
