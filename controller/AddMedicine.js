import Medicine from "../models/Medicine.js";
import mongoose from "mongoose";
// ✅ Create
export const createMedicine = async (req, res) => {
  try {
    const { name, type, price, quantity, mfgDate, expireDate } = req.body;

    // 🔍 Basic field validation
    if (!name || !type || !price || !quantity || !mfgDate || !expireDate) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 🔍 Check for existing medicine by name (case-insensitive)
    const existing = await Medicine.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(409).json({ error: "Medicine with this name already exists." });
    }

    // ✅ Create and save
    const newMedicine = new Medicine(req.body);
    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get All Medicines
export const getAllMedicines = async (req, res) => {
  try {
    const meds = await Medicine.find();

    if (meds.length === 0) {
      return res.status(404).json({ message: "No medicines found." });
    }

    res.status(200).json(meds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Medicine By ID
export const getMedicineById = async (req, res) => {
  const { id } = req.params;

  // 🔍 Check for valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid medicine ID." });
  }

  try {
    const med = await Medicine.findById(id);
    if (!med) return res.status(404).json({ error: "Medicine not found." });
    res.status(200).json(med);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Medicine
export const updateMedicine = async (req, res) => {
  const { id } = req.params;

  // 🔍 Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid medicine ID." });
  }

  try {
    const updated = await Medicine.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // ensure validation while updating
    });

    if (!updated) return res.status(404).json({ error: "Medicine not found." });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Medicine
export const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  // 🔍 Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid medicine ID." });
  }

  try {
    const deleted = await Medicine.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Medicine not found." });

    res.status(200).json({ message: "Medicine deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
