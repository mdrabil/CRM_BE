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

  getTodayTreatments,

} from "../controller/CreatePatient.js";
import { authMiddleware } from "../middleware/auth.js";
import { dispenseMedicines, FinalMedicineUpdate, getTreatmentById, getTreatmentByStatus, getTreatments, getTreatmentsFilter, updateTreatment, updateTreatmentAgain } from "../controller/TreatmentControll.js";

const router = express.Router();

// Treatments Routes
router.get("/today",authMiddleware, getTodayTreatments);                        // Get all or by patientId
router.post("/", addTreatment);                        // Add treatment
router.get("/", getTreatments);                        // Get all or by patientId
router.get("/filter", getTreatmentsFilter);                        // Get all or by patientId
router.get("/:id", getTreatmentById);   
router.put("/:id", updateTreatmentAgain);   
                     // Get all or by patientId
// router.patch("/:id/dispense", dispenseMedicines);    
router.put("/:id/dispense", dispenseMedicines);    
router.patch("/:id/status", updateTreatment);    
router.get("/status/:status", getTreatmentByStatus);    
// router.patch("/:id/instructions", giveInstructions);   
router.put("/:id/instructions", FinalMedicineUpdate);   


export default router;
