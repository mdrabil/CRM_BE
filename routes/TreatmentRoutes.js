// import express from 'express';
// import { createTreatment, deleteTreatment, getAllTreatments, getTreatmentById, updateTreatment } from '../controller/TreatmentControll.js';


// const router = express.Router();

// router.post('/', createTreatment);
// router.get('/', getAllTreatments);
// router.get('/:id', getTreatmentById);
// router.put('/:id', updateTreatment);
// router.delete('/:id', deleteTreatment);

// export default router;


import express from "express";
import {
  addTreatment,
  getTreatments,
  dispenseMedicines,
  giveInstructions,
  getTodayTreatments,
} from "../controller/CreatePatient.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Treatments Routes
router.post("/", addTreatment);                        // Add treatment
router.get("/", getTreatments);                        // Get all or by patientId
router.get("/today",authMiddleware, getTodayTreatments);                        // Get all or by patientId
router.patch("/:id/dispense", dispenseMedicines);      // Dispense medicines
router.patch("/:id/instructions", giveInstructions);   // Give instructions

export default router;
