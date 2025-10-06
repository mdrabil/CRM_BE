import PatientModel from "../models/PatientData.js";
import Treatment from "../models/Treatment.js";



const generateNextFixedPermanentId = async () => {
  const lastPatient = await PatientModel.findOne().sort({ createdAt: -1 });
  let lastId = lastPatient?.fixedPermanentId?.split("-")[1] || "0000";
  let nextId = (parseInt(lastId) + 1).toString().padStart(4, "0");
  return `PNo-${nextId}`;
};

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

  const count = await Treatment?.countDocuments({
    treatmentDate: { $gte: startOfDay, $lte: endOfDay },
  });

  // Example: 20250927-001
  const yyyy = startOfDay.getFullYear();
  const mm = String(startOfDay.getMonth() + 1).padStart(2, "0");
  const dd = String(startOfDay.getDate()).padStart(2, "0");

  return `${String(count + 1).padStart(3, "0")}`;
};

// ✅ Create or Update Patient
// ✅ Create or Update Patient + First Treatment
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
    treatmentDate,
    booking_mode
  } = req.body;

  try {
    // Default today
    const visitDate = treatmentDate ? new Date(treatmentDate) : new Date();
    const localVisitDate = getLocalStartOfDay(visitDate);



    console.log('treatmnet data',treatmentDate)
    // Generate patient code + permanent ID

       const existingTreatment = await Treatment.findOne({
      patientId: await PatientModel.findOne({ patientName, phone }).select("_id"),
      treatmentDate: { $gte: localVisitDate, $lte: getLocalEndOfDay(localVisitDate) }
    });

    if (existingTreatment) {
      return res.status(400).json({ message: "Patient already has an appointment today!" });
    }



    const patientCode = await generateBookingIdByDate(localVisitDate);
    const fixedPermanentId = await generateNextFixedPermanentId();

    // Check existing patient
    let patient = await PatientModel.findOne({ patientName, phone });

    if (!patient) {
      // 🔹 New patient create
      patient = new PatientModel({
        patientName,
        dateOfBirth,
        age,
        reasonForVisit,
        address,
        phone,
        gender,
        status: "new",
        fixedPermanentId,
        booking_mode: booking_mode || "offline",
        treatmentDate: localVisitDate,
      });
      await patient.save();
    } else {
 
      patient.status = "old";
      await patient.save();
    }

    // 🔹 Create treatment immediately
    const treatment = new Treatment({
      patientCode:patientCode,
      patientId: patient._id,
      booking_mode: patient.booking_mode,
      Patienpatientcodetcode: patient.patientCode,
      visitreason: patient.reasonForVisit,
      status: "pending", 
      treatmentDate: localVisitDate,
    });

    await treatment.save();

    io.emit("new_patient_added", patient);
    res.status(201).json({
      message: "Patient & Treatment created successfully",
      patient,
      treatment,
    });
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

// export const getTodaysPatients = async (req, res) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     // ✅ Filter by treatmentDate instead of createdAt
//     const patients = await PatientModel.find({
//       treatmentDate: { $gte: startOfDay, $lte: endOfDay }
//     }).sort({ treatmentDate: -1 });

//     res.json(patients);
//   } catch (error) {
//     console.error("Error fetching today's patients:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getTodaysPatients = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const patients = await PatientModel.find({
      treatmentDate: { $gte: startOfDay, $lte: endOfDay }
    }).lean(); // lean() optional, faster queries

    // Custom status order
    const statusOrder = [
      "checking_start",
      "new",
      "checked_by_doctor",
      "medicines_dispensed",
      "instructions_given",
      "completed"
    ];

    // Sort patients
    patients.sort((a, b) => {
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);

      if (statusA !== statusB) return statusA - statusB;

      // Agar status same hai aur "new" hai, to recently added top
      if (a.status === "new") return new Date(b.createdAt) - new Date(a.createdAt);

      // Otherwise same order
      return 0;
    });

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



// GET /api/patients?status=new
export const getPatientsByStatus = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    console.log('heere data kya hai ',status)


    if (status) filter.status = status;
    if (date) {
      filter.treatmentDate = {
        $gte: getLocalStartOfDay(date),
        $lte: getLocalEndOfDay(date)
      };
    }

    const patients = await PatientModel.find(filter).sort({ treatmentDate: 1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/patients/:id/status
export const updatePatientStatus = async (req, res) => {
  const io = req.app.get("io");
  try {
    const { id } = req.params;
    const { status }= req.body;
    console.log('hit api or not',status)

    const patient = await PatientModel.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.status = status;
    await patient.save();

    io.emit("patient_status_updated", patient);
    res.status(200).json({ message: "Status updated", patient });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// POST /api/treatments
export const addTreatment = async (req, res) => {
  const io = req.app.get("io");

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
         todaybooking_mode:existingPatient?.booking_mode,
      todayPatientcode:existingPatient?.patientCode,
      todayvisitreason:existingPatient?.reasonForVisit,
      patientId,
      medicines,
      doctorName: "Dr. HAKIM", 
      patinentProblem,
      symptoms
    });


    console.log('success')
    await newTreatment.save();
    console.log('success 1')

      existingPatient.status = "checked_by_doctor";
    existingPatient.lastTreatmentId = newTreatment._id;
    await existingPatient.save();

    io.emit("treatment_added", { existingPatient, newTreatment });
    res.status(201).json({ message: "Treatment added", newTreatment });
  

    await existingPatient.save();
    console.log('success3')

    res.status(201).json({ message: "Treatment created successfully", newTreatment });
  } catch (error) {
    res.status(500).json({ message: "Error creating treatment", error: error.message });
  }

}







// GET /api/treatments?patientId=xxx


export const getTodayTreatments = async (req, res) => {
  try {
    // Aaj ka start aur end time
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Filter bana lo
    const filter = {
      treatmentDate: { $gte: startOfToday, $lte: endOfToday },
    };

   

    const treatments = await Treatment.find(filter).populate("patientId");

    res.status(200).json(treatments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// GET /api/patients?status=new&date=2025-09-30
// export const getPatientsByStatus = async (req, res) => {
//   try {
//     const { status, date } = req.query;
//     const filter = {};

//     if (status) filter.status = status;

//     if (date) {
//       filter.treatmentDate = {
//         $gte: getLocalStartOfDay(date),
//         $lte: getLocalEndOfDay(date)
//       };
//     }

//     const patients = await PatientModel.find(filter).sort({ treatmentDate: 1 });
//     res.status(200).json(patients);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// export const updateTreatment = async (req, res) => {
//   const io = req.app.get("io");
//   try {
//     const { id } = req.params;
// const {status} = req.body
//     const treatment = await Treatment.findById(id);
//     if (!treatment) return res.status(404).json({ message: "Treatment not found" });

//     treatment.status = status;
//     await treatment.save();

//     io.emit("medicines_dispensed", {  treatment });
//     res.status(200).json({ message: "Medicines dispensed", treatment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// PATCH /api/treatments/:id/instructions
export const giveInstructions = async (req, res) => {
  const io = req.app.get("io");
  try {
    const { id } = req.params;

    const treatment = await Treatment.findById(id);
    if (!treatment) return res.status(404).json({ message: "Treatment not found" });

    treatment.instructionsGiven = true;
    await treatment.save();

    const patient = await PatientModel.findById(treatment.patientId);
    patient.status = "completed";
    await patient.save();

    io.emit("instructions_given", { patient, treatment });
    res.status(200).json({ message: "Instructions given", treatment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// GET /api/patients/completed?date=yyyy-mm-dd
export const getCompletedPatients = async (req, res) => {
  try {
    const { date } = req.query;

    const filter = { status: "instructions_given" };
    if (date) {
      filter.treatmentDate = {
        $gte: getLocalStartOfDay(date),
        $lte: getLocalEndOfDay(date)
      };
    }

    const patients = await PatientModel.find(filter).sort({ treatmentDate: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

