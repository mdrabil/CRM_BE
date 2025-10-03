import express from "express";
import {
  createPatient,
  getAllPatients,
  getTodaysPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getPatientsByStatus,
  updatePatientStatus,
  getCompletedPatients,
  addTreatment,
  getTreatments,
  dispenseMedicines,
  giveInstructions
} from "../controller/CreatePatient.js";

const router = express.Router();

// ------------------ PATIENT ROUTES ------------------
// Create a new patient
router.post("/", createPatient);

// Get all patients (optionally filter by query: ?status=xxx&date=yyyy-mm-dd)
router.get("/status", getPatientsByStatus);
router.get("/", getAllPatients);

// Get today's patients
router.get("/today", getTodaysPatients);

// Get completed patients (optionally filter by date)
router.get("/completed", getCompletedPatients);

// Get single patient by ID
router.get("/:id", getPatient);

// Update patient fully by ID
router.put("/:id", updatePatient);

// Update only patient status
router.patch("/:id/status", updatePatientStatus);

// Delete patient by ID
router.delete("/:id", deletePatient);
// Get patients by status

// ------------------ TREATMENT ROUTES ------------------
// Add treatment for a patient
router.post("/treatments", addTreatment);

// Get treatments (optionally by patientId)
router.get("/treatments", getTreatments);

// Mark medicines as dispensed
router.patch("/treatments/:id/dispense", dispenseMedicines);

// Mark instructions as given
router.patch("/treatments/:id/instructions", giveInstructions);

export default router;
