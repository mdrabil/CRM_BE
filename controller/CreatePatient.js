import PatientModel from "../models/PatientData.js";
import moment from 'moment'




// import generateNextFixedPermanentId from "../utility/genrateNextNumber.js";
// CREATE
// export const createPatient = async (req, res) => {
//   const {
//     patientName,
//     dateOfBirth,
//     age,
//     reasonForVisit,
//     address,
//     phone,
//     gender,
//     status
//   } = req.body;
// console.log('name',patientName)
//   try {
//     // Check duplicate by name and phone
//     const existing = await PatientModel.findOne({ patientName, phone });
//     if (existing) {
//       return res.status(400).json({ message: "Patient with same name and phone already exists" });
//     }
//     const today = moment().startOf("day");
//     const tomorrow = moment(today).add(1, "days");

//     // Get count of today's patients
//     const count = await PatientModel.countDocuments({
//       createdAt: {
//         $gte: today.toDate(),
//         $lt: tomorrow.toDate(),
//       },
//     });

//     const patientCode = (count + 1).toString().padStart(3, "0"); // "001", "002", ...


//     const patient = new PatientModel({
//       patientName,
//       dateOfBirth,
//       age,
//       reasonForVisit,
//       address,
//       phone,
//       gender,
//       status,
//       patientCode
//     });

//     // await patient.validate(); 
//     await patient.save();

//     res.status(201).json({ message: "Patient created", patient });

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const createPatient = async (req, res) => {
//   const {
//     patientName,
//     dateOfBirth,
//     age,
//     reasonForVisit,
//     address,
//     phone,
//     gender,
//     status
//   } = req.body;

//   try {
//     const existing = await PatientModel.findOne({ patientName, phone });

//     const today = moment().startOf("day");
//     const tomorrow = moment(today).add(1, "days");

//     const count = await PatientModel.countDocuments({
//       createdAt: {
//         $gte: today.toDate(),
//         $lt: tomorrow.toDate(),
//       },
//     });

//     const patientCode = (count + 1).toString().padStart(3, "0"); // 001, 002, etc.

//     if (existing) {
//       // Update reasonForVisit & patientCode
//       existing.reasonForVisit = reasonForVisit;
//       existing.patientCode = patientCode;
//       await existing.save();

//       return res.status(200).json({
//         message: "Existing patient updated with new visit reason",
//         patient: existing,
//       });
//     }

//         const fixedPermanentId = await generateNextFixedPermanentId();

//     // New patient creation
//     const patient = new PatientModel({
//       patientName,
//       dateOfBirth,
//       age,
//       reasonForVisit,
//       address,
//       phone,
//       gender,
//       status,
//       patientCode,
//       fixedPermanentId
//     });

//     await patient.save();

//     res.status(201).json({ message: "Patient created", patient });

//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// Helper: Get next available patientCode for today
const generatePatientCodeToday = async () => {
  const today = moment().startOf("day");
  const tomorrow = moment(today).add(1, "days");

  const count = await PatientModel.countDocuments({
    createdAt: {
      $gte: today.toDate(),
      $lt: tomorrow.toDate(),
    },
  });

  return (count + 1).toString().padStart(3, "0"); // '001', '002', etc.
};

// Helper: Get next permanent fixed ID
const generateNextFixedPermanentId = async () => {
  const lastPatient = await PatientModel.findOne().sort({ createdAt: -1 });
  let lastId = lastPatient?.fixedPermanentId?.split("-")[1] || "0000";
  let nextId = (parseInt(lastId) + 1).toString().padStart(4, "0");
  return `PNo-${nextId}`;
};

export const createPatient = async (req, res) => {

    const io = req.app.get("io"); // ✅ working
  const {
    patientName,
    dateOfBirth,
    age,
    reasonForVisit,
    address,
    phone,
    gender,
    status,
  } = req.body;

  try {
    const existing = await PatientModel.findOne({ patientName, phone });

    const today = moment().startOf("day");
    const tomorrow = moment(today).add(1, "days");

    // ⏺ Existing patient
    if (existing) {
      // Check if already has today's patientCode
      const createdDate = moment(existing.createdAt);
      const isToday =
        createdDate.isSameOrAfter(today) && createdDate.isBefore(tomorrow);

      if (!isToday) {
        const newCode = await generatePatientCodeToday();
        existing.patientCode = newCode;
      }

      existing.reasonForVisit = reasonForVisit;

      await existing.save();

      return res.status(200).json({
        message: "Existing patient updated with new visit reason",
        patient: existing,
      });
    }

    // ⏺ New patient
    const patientCode = await generatePatientCodeToday();
    const fixedPermanentId = await generateNextFixedPermanentId();

    const patient = new PatientModel({
      patientName,
      dateOfBirth,
      age,
      reasonForVisit,
      address,
      phone,
      gender,
      status,
      patientCode,
      fixedPermanentId,
    });

    await patient.save();
io.emit("new_patient_added", patient);
    res.status(201).json({ message: "Patient created", patient });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// READ ALL
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// controllers/patientController.js
export const searchQueryPatient = async (req, res) => {
  const { name, phone, patientCode } = req.query;

  const query = {};

  if (name) {
    query.patientName = { $regex: name, $options: "i" };
  }

  if (phone) {
    query.phone = { $regex: phone }; // partial match
  }

  if (patientCode) {
    query.patientCode = patientCode;
  }

  try {
    const patients = await PatientModel.find(query).sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients", error });
  }
};

// controllers/patientController.js
export const getTodaysPatients = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const patients = await PatientModel.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error("Error fetching today's patients:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// READ ONE
export const getPatient = async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: "Invalid patient ID" });
  }
};

// UPDATE
export const updatePatient = async (req, res) => {
  try {
    const updated = await PatientModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient updated", patient: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deletePatient = async (req, res) => {
  try {
    const deleted = await PatientModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid patient ID" });
  }
};
