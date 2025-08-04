import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controller/AddMedicine.js";
import { authMiddleware, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", createMedicine);
router.get("/getall", getAllMedicines);
router.get("/getone/:id", getMedicineById);
router.put("/update/:id", updateMedicine);
router.delete("/delete/:id",authMiddleware,authorize('delete'), deleteMedicine);

export default router;
