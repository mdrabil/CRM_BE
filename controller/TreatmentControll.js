import PatientModel from "../models/PatientData.js";
import Treatment from "../models/Treatment.js";
// CREATE
// export const createTreatment = async (req, res) => {
//   try {
//     const treatment = new Treatment(req.body);
//     await treatment.save();
//     res.status(201).json({ message: "Treatment created", treatment });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating treatment", error: error.message });
//   }
// };



export const createTreatment = async (req, res) => {
  try {
    const {  patientId, date, doctorName, medicines } = req.body;

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({ message: "Patient name and ID are required" });
    }

    // Optionally check if patient exists in Patient model (if available)
    const existingPatient = await PatientModel.findById(patientId);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create new treatment
    const treatment = new Treatment({
      
      patientId,
      date,
      doctorName,
      medicines,
    });

    await treatment.save();

    res.status(201).json({ message: "Treatment created successfully", treatment });
  } catch (error) {
    res.status(500).json({ message: "Error creating treatment", error: error.message });
  }
};


// READ ALL
export const getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find().populate("patientId");
    res.status(200).json(treatments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching treatments", error: error.message });
  }
};

// READ BY ID
export const getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id).populate("patientId");
    if (!treatment) return res.status(404).json({ message: "Treatment not found" });
    res.status(200).json(treatment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching treatment", error: error.message });
  }
};

// UPDATE
export const updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!treatment) return res.status(404).json({ message: "Treatment not found" });
    res.status(200).json({ message: "Treatment updated", treatment });
  } catch (error) {
    res.status(500).json({ message: "Error updating treatment", error: error.message });
  }
};

// DELETE
export const deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ message: "Treatment not found" });
    res.status(200).json({ message: "Treatment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting treatment", error: error.message });
  }
};
