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

router.post("/", createMedicine);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id",authMiddleware,authorize('delete'), deleteMedicine);

export default router;
