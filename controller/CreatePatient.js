import PatientModel from "../models/PatientData.js";


// done wala hai 
// const generatePatientCodeToday = async () => {
//   const today = moment().startOf("day");
//   const tomorrow = moment(today).add(1, "days");

//   const count = await PatientModel.countDocuments({
//     createdAt: {
//       $gte: today.toDate(),
//       $lt: tomorrow.toDate(),
//     },
//   });

//   return (count + 1).toString().padStart(3, "0"); // '001', '002', etc.
// };

// // Helper: Get next permanent fixed ID
// const generateNextFixedPermanentId = async () => {
//   const lastPatient = await PatientModel.findOne().sort({ createdAt: -1 });
//   let lastId = lastPatient?.fixedPermanentId?.split("-")[1] || "0000";
//   let nextId = (parseInt(lastId) + 1).toString().padStart(4, "0");
//   return `PNo-${nextId}`;
// };

// export const createPatient = async (req, res) => {

//     const io = req.app.get("io"); // ✅ working
//   const {
//     patientName,
//     dateOfBirth,
//     age,
//     reasonForVisit,
//     address,
//     phone,
//     gender,
//     status,
//     treatmentDate,
//   } = req.body;


//   try {
//     const existing = await PatientModel.findOne({ patientName, phone });
// const visitDate = treatmentDate ? moment(treatmentDate).startOf("day") : moment().startOf("day");
//     const today = moment().startOf("day");
//     const tomorrow = moment(today).add(1, "days");

//     // ⏺ Existing patient
//     if (existing) {
//       // Check if already has today's patientCode
//       const createdDate = moment(existing.createdAt);
//       const isToday =
//         createdDate.isSameOrAfter(today) && createdDate.isBefore(tomorrow);

//       if (!isToday) {
//         const newCode = await generatePatientCodeToday();
//         existing.patientCode = newCode;
//       }

//       existing.reasonForVisit = reasonForVisit;

//       await existing.save();

//       return res.status(200).json({
//         message: "Existing patient updated with new visit reason",
//         patient: existing,
//       });
//     }

//     // ⏺ New patient
//     const patientCode = await generatePatientCodeToday();
//     const fixedPermanentId = await generateNextFixedPermanentId();

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
//       fixedPermanentId,
//       treatmentDate: visitDate.toDate(),
//     });

//     await patient.save();
// io.emit("new_patient_added", patient);
//     res.status(201).json({ message: "Patient created", patient });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// READ ALL




// ✅ Permanent ID generator
const generateNextFixedPermanentId = async () => {
  const lastPatient = await PatientModel.findOne().sort({ createdAt: -1 });
  let lastId = lastPatient?.fixedPermanentId?.split("-")[1] || "0000";
  let nextId = (parseInt(lastId) + 1).toString().padStart(4, "0");
  return `PNo-${nextId}`;
};


// const generateBookingIdByDate = async (treatmentDate) => {
//   const startOfDay = new Date(treatmentDate);
//   startOfDay.setHours(0, 0, 0, 0);

//   const endOfDay = new Date(startOfDay);
//   endOfDay.setDate(endOfDay.getDate() + 1);

//   const count = await PatientModel.countDocuments({
//     treatmentDate: { $gte: startOfDay, $lt: endOfDay },
//   });

//   return `${String(count + 1).padStart(3, "0")}`;
// };

// // ✅ Create or Update Patient
// export const createPatient = async (req, res) => {
//   const io = req.app.get("io");

//   const {
//     patientName,
//     dateOfBirth,
//     age,
//     reasonForVisit,
//     address,
//     phone,
//     gender,
//     status,
//     treatmentDate,
//   } = req.body;

//   try {
//     // ⏺ Agar frontend se date nahi aayi → default today
//     const visitDate = treatmentDate ? new Date(treatmentDate) : new Date();
//     visitDate.setHours(0, 0, 0, 0); // Reset time to start of day

//     // ⏺ Check existing patient (same phone & same treatmentDate)
//     const existing = await PatientModel.findOne({
//       patientName,
//       phone,
//     });
//     const patientCode = await generateBookingIdByDate(visitDate);

//     if (existing) {
//       // Update reason & date
//       existing.reasonForVisit = reasonForVisit;
//       existing.treatmentDate = visitDate;
//       existing.patientCode = patientCode;
//       await existing.save();

//       return res.status(200).json({
//         message: "Existing patient updated with new visit reason",
//         patient: existing,
//       });
//     }

//     // ⏺ New patient entry
//     const fixedPermanentId = await generateNextFixedPermanentId();

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
//       fixedPermanentId,
//       treatmentDate: visitDate, // ✅ Save booking date
//     });

//     await patient.save();
//     io.emit("new_patient_added", patient);

//     res.status(201).json({ message: "Patient created", patient });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// Helper: Local start of day
const getLocalStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // 12:00 AM local time
  return d;
};

// Helper: Local end of day
const getLocalEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999); // 11:59:59 PM local time
  return d;
};

// Booking ID generator (date wise)
const generateBookingIdByDate = async (visitDate) => {
  const startOfDay = getLocalStartOfDay(visitDate);
  const endOfDay = getLocalEndOfDay(visitDate);

  const count = await PatientModel.countDocuments({
    treatmentDate: { $gte: startOfDay, $lte: endOfDay },
  });

  // Example: 20250927-001
  const yyyy = startOfDay.getFullYear();
  const mm = String(startOfDay.getMonth() + 1).padStart(2, "0");
  const dd = String(startOfDay.getDate()).padStart(2, "0");

  return `${String(count + 1).padStart(3, "0")}`;
};

// ✅ Create or Update Patient
export const createPatient = async (req, res) => {
  const io = req.app.get("io");

  const {
    patientName,
    dateOfBirth,
    age,
    reasonForVisit,
    address,
    phone,
    gender,
    status,
    treatmentDate,
    booking_mode
  } = req.body;

  try {
    // Agar frontend date nahi aayi → default today
    const visitDate = treatmentDate ? new Date(treatmentDate) : new Date();
    
    const localVisitDate = getLocalStartOfDay(visitDate); // ✅ Local 12 AM

    // Generate patient code for this date
    const patientCode = await generateBookingIdByDate(localVisitDate);
    const fixedPermanentId = await generateNextFixedPermanentId();

    // Check existing patient (same phone & same date)
    const existing = await PatientModel.findOne({
      patientName,
      phone,
    });

    if (existing) {
      existing.reasonForVisit = reasonForVisit;
      existing.treatmentDate = localVisitDate;
      existing.patientCode = patientCode;
      existing.booking_mode = booking_mode;

      await existing.save();
  io.emit("new_patient_added", existing);
      return res.status(200).json({
        message: "Existing patient updated with new visit reason",
        patient: existing,
      });
    }

    // New patient entry
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
      booking_mode:booking_mode ? booking_mode :'offline',
      treatmentDate: localVisitDate, // ✅ Save visitDate as local start of day
    });

    await patient.save();
    io.emit("new_patient_added", patient);

    res.status(201).json({ message: "Patient created", patient });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



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


// export const getTodaysPatients = async (req, res) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const patients = await PatientModel.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay }
//     }).sort({ createdAt: -1 });

//     res.json(patients);
//   } catch (error) {
//     console.error("Error fetching today's patients:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// READ ONE


export const getTodaysPatients = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Filter by treatmentDate instead of createdAt
    const patients = await PatientModel.find({
      treatmentDate: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ treatmentDate: -1 });

    res.json(patients);
  } catch (error) {
    console.error("Error fetching today's patients:", error);
    res.status(500).json({ message: "Server error" });
  }
};



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
