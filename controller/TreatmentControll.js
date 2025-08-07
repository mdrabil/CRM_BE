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



// export const createTreatment = async (req, res) => {
//   try {
//     const {  patientId, date, doctorName, medicines } = req.body;

//     // Validate required fields
//     if (!patientId) {
//       return res.status(400).json({ message: "Patient name and ID are required" });
//     }

//     // Optionally check if patient exists in Patient model (if available)
//     const existingPatient = await PatientModel.findById(patientId);
//     if (!existingPatient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }




//     // Create new treatment
//     const treatment = new Treatment({
      
//       patientId,
//       date,
//       doctorName,
//       medicines,
//     });

//     console.log('success')
//     await treatment.save();
//     console.log('success 1')

//     // ✅ Update patient status to 'treated'
//     existingPatient.status = "treated";
//     console.log('success2')

//     await existingPatient.save();
//     console.log('success3')

//     res.status(201).json({ message: "Treatment created successfully", treatment });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating treatment", error: error.message });
//   }
// };


export const createTreatment = async (req, res) => {
  try {
    const {  patientId, patientmedicine ,patinentProblem,symptoms  } = req.body;

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({ message: "Patient name and ID are required" });
    }

    // Optionally check if patient exists in Patient model (if available)
    const existingPatient = await PatientModel.findById(patientId);
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }


    // Convert patientmedicine to medicines as per schema
    const medicines = patientmedicine.map((med) => ({
      name: med.name,
      quantity: 1, // Or dynamic if needed
      dosageMl: med.dose ? parseFloat(med.dose) : undefined,
      type: med.name.toLowerCase().includes("syrup") ? "Syrup" : "Tablet", // Just example logic
      times: med.frequency,
    }));
    
    // Create new treatment
    const newTreatment = new Treatment({
      patientId,
      medicines,
      doctorName: "Dr. ABC", 
      patinentProblem,
      symptoms
    });


    console.log('success')
    await newTreatment.save();
    console.log('success 1')

    // ✅ Update patient status to 'treated'
    existingPatient.status = "treated";
    console.log('success2')

    await existingPatient.save();
    console.log('success3')

    res.status(201).json({ message: "Treatment created successfully", newTreatment });
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
  
  console.log('patinet id',req.params?.id)
  try {

    const treatment = await Treatment.find({ patientId: req.params.id }).populate("patientId");

    // const treatment = await Treatment.findById(req.params.id).populate("patientId");

// console.log('data',treatment)

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
