import Medicine from "../models/Medicine.js";
import PatientModel from "../models/PatientData.js";
import Treatment from "../models/Treatment.js";








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
// export const createTreatment = async (req, res) => {
//   try {
//     const {  patientId, patientmedicine ,patinentProblem,symptoms  } = req.body;

//     // Validate required fields
//     if (!patientId) {
//       return res.status(400).json({ message: "Patient name and ID are required" });
//     }

//     // Optionally check if patient exists in Patient model (if available)
//     const existingPatient = await PatientModel.findById(patientId);
//     if (!existingPatient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }


//     // Convert patientmedicine to medicines as per schema
//     const medicines = patientmedicine.map((med) => ({
//       name: med.name,
//       quantity: 1, // Or dynamic if needed
//       dosageMl: med.dose ? parseFloat(med.dose) : undefined,
//       type: med.name.toLowerCase().includes("syrup") ? "Syrup" : "Tablet", // Just example logic
//       times: med.frequency,
//     }));
    
//     // Create new treatment
//     const newTreatment = new Treatment({
//       patientId,
//       medicines,
//       doctorName: "Dr. ABC", 
//       patinentProblem,
//       symptoms
//     });


//     console.log('success')
//     await newTreatment.save();
//     console.log('success 1')

//     // ✅ Update patient status to 'treated'
//     existingPatient.status = "treated";
//     console.log('success2')

//     await existingPatient.save();
//     console.log('success3')

//     res.status(201).json({ message: "Treatment created successfully", newTreatment });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating treatment", error: error.message });
//   }
// };

// READ ALL
// export const getAllTreatments = async (req, res) => {
//   try {
//     const treatments = await Treatment.find().populate("patientId");
//     res.status(200).json(treatments);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching treatments", error: error.message });
//   }
// };

// READ BY ID
// controller/TreatmentController.js



// all but i am ading filter 

export const getTreatments = async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = {};
    if (patientId) filter.patientId = patientId;

    // const treatments = await Treatment.find(filter).populate("patientId");
        const treatments = await Treatment.find({ status: "completed" }).populate("patientId");

    res.status(200).json(treatments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// GET /api/treatments?name=Rabil&phone=9876543210&date=2025-10-06

export const getTreatmentsFilter = async (req, res) => {
  try {
    const { id, name, patientCode, phone, date ,paitentId } = req.query;

    const filter = {};

    if (id) filter._id = id;
    if (patientCode) filter.patientCode = { $regex: patientCode, $options: "i" };
    if (date) {
      const d = new Date(date);
      filter.treatmentDate = { 
        $gte: getLocalStartOfDay(d), 
        $lte: getLocalEndOfDay(d) 
      };
    }

    // Populate patientId with match
    const populateOptions = {};
    if (name || phone || paitentId) {
      populateOptions.path = "patientId";
      populateOptions.match = {};
      if (name) populateOptions.match.patientName = { $regex: name, $options: "i" };
      if (paitentId) populateOptions.match.fixedPermanentId = { $regex: paitentId, $options: "i" };
      if (phone) populateOptions.match.phone = { $regex: phone, $options: "i" };
    }

    let query = Treatment.find(filter);

    if (Object.keys(populateOptions).length) {
      query = query.populate(populateOptions);
    } else {
      query = query.populate("patientId");
    }

    const treatments = await query.exec();

    // Filter out treatments with no populated patient (because of match)
    const filteredTreatments = treatments.filter(t => t.patientId !== null);

    res.status(200).json(filteredTreatments);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};




export const getTreatmentById = async (req, res) => {
  try {
    const { id } = req.params; // <-- ab id milega
    const treatment = await Treatment.findById(id).populate("patientId");
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.json(treatment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching treatment", error: error.message });
  }
};

export const getTreatmentByStatus = async (req, res) => {
  try {
    const { status } = req.params; 
    const treatment = await Treatment.find({status}).populate("patientId");
    if (!treatment) {
      return res.status(404).json({ message: "No treatments found for this status" });
    }

    //     if (treatment.length === 0) {
    //   return res.status(404).json({ message: "No treatments found for this status" });
    // }
    res.json(treatment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching treatment", error: error.message });
  }
};

// UPDATE
// export const updateTreatment = async (req, res) => {
//   try {
//     const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!treatment) return res.status(404).json({ message: "Treatment not found" });
//     res.status(200).json({ message: "Treatment updated", treatment });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating treatment", error: error.message });
//   }
// };

export const updateTreatment = async (req, res) => {
  const io = req.app.get("io");
  try {
    const { id } = req.params;
const {status} = req.body
    const treatment = await Treatment.findById(id);
    if (!treatment) return res.status(404).json({ message: "Treatment not found" });

    treatment.status = status;
    await treatment.save();

    io.emit("update_status", {  treatment });
    res.status(200).json({ message: "Medicines dispensed", treatment });
  } catch (error) {
    res.status(400).json({ message: error.message });
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



// PUT /api/treatments/:id
export const updateTreatmentAgain = async (req, res) => {
    const io = req.app.get("io");
  try {
    const { id } = req.params; // Treatment ID
    const { patientmedicine, patinentProblem, symptoms, restrictions ,nOfDaysMedicine } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Treatment ID is required" });
    }

const nOfDaysMedicineGet =nOfDaysMedicine ? nOfDaysMedicine : "5"

    const medicines = patientmedicine.map((med) => ({
      name: med.name,
      quantity: med.quantity || null,
      dosageMl: med.dose ? parseFloat(med.dose) : undefined,
   type: med.type
        ? med.type // if type is already provided
        : med.name.toLowerCase().includes("syrup")
        ? "Syrup"
        : med.name.toLowerCase().includes("inject")
        ? "Injection"
        : "Tablet",
      times: med.frequency || {}, // ensure frequency object exists
    }));

    

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      id,
      {
        patinentProblem,
        symptoms,
        restrictions,
        medicines,
        doctorName: "Dr. Hakim",
        status: "checked_by_doctor",
        nOfDaysMedicine:nOfDaysMedicineGet
      },
      { new: true }
    );

    if (!updatedTreatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }


        io.emit("check_ed_by_dr", {  treatment:updatedTreatment });
    res.json({
      message: "Treatment updated successfully",
      treatment: updatedTreatment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating treatment", error: error.message });
  }
};


// PATCH /api/treatments/:id/dispense
// export const dispenseMedicines = async (req, res) => {
//   const io = req.app.get("io");
//   try {
//     const { id } = req.params;

//     const treatment = await Treatment.findById(id);
//     if (!treatment) return res.status(404).json({ message: "Treatment not found" });

//     treatment.dispensed = true;
//     treatment.status = "medicines_dispensed";
//     await treatment.save();



//     io.emit("medicines_dispensed", {  treatment });
//     res.status(200).json({ message: "Medicines dispensed", treatment });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// without price 
// export const dispenseMedicines = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { patientmedicine, nOfDaysMedicine, status } = req.body;

//     if (!id) {
//       return res.status(400).json({ message: "Treatment ID is required" });
//     }

//     // Default days if not provided
//     const nOfDaysMedicineGet = nOfDaysMedicine || 5;

//     const medicines = patientmedicine.map((med) => ({
//       name: med.name,
//       quantity: med.quantity || 1,
//       dosageMl: med.dose ? parseFloat(med.dose) : undefined,
//       type: med.type
//         ? med.type // if type is already provided
//         : med.name.toLowerCase().includes("syrup")
//         ? "Syrup"
//         : med.name.toLowerCase().includes("inject")
//         ? "Injection"
//         : "Tablet",
//       times: med.frequency || {}, // ensure frequency object exists
//     }));

//     const updatedTreatment = await Treatment.findByIdAndUpdate(
//       id,
//       {
//         medicines,
//         dispensed: true,
//         status: status || "medicines_dispensed",
//         nOfDaysMedicine: nOfDaysMedicineGet,
//       },
//       { new: true }
//     );

//     if (!updatedTreatment) {
//       return res.status(404).json({ message: "Treatment not found" });
//     }

//     res.json({
//       message: "Treatment updated successfully",
//       treatment: updatedTreatment,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating treatment", error: error.message });
//   }
// };



export const dispenseMedicines = async (req, res) => {
  const io = req.app.get("io");

  try {
    const { id } = req.params;
    const { patientmedicine, nOfDaysMedicine, status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Treatment ID is required" });
    }

    const existingTreatment = await Treatment.findById(id);
    if (!existingTreatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }

    const nOfDaysMedicineGet = nOfDaysMedicine || existingTreatment.nOfDaysMedicine || 5;

    let totalPrice = 0;

    const medicines = await Promise.all(
      patientmedicine.map(async (med) => {
        const existingMed = existingTreatment.medicines.find((m) => m.name === med.name);

        // If price not sent, take existing or from Medicine collection
        let price = med.price ?? existingMed?.price;
        if (!price) {
          const medicineDoc = await Medicine.findOne({ name: med.name });
          price = medicineDoc ? medicineDoc.price : 0;
        }

        // const quantity =  null;
        const quantity = med.quantity ?? existingMed?.quantity ?? 1;
        totalPrice += price * quantity;
console.log('quaitntu',quantity)
        return {
          name: med.name,
          type: existingMed?.type ?? med.type ?? "Tablet",
          quantity,         // ✅ only update quantity
          medicinePrice:price,            // ✅ only update price
          dosageMl: existingMed?.dosageMl, // keep old
          times: existingMed?.times || {}, // keep old
        };
      })
    );

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      id,
      {
        medicines,
        dispensed: true,
        status: status || existingTreatment.status,
        nOfDaysMedicine: nOfDaysMedicineGet,
        totalPrice,
      },
      { new: true }
    );


      io.emit("medicine_dispanced", {  treatment:updatedTreatment });
    res.json({
      message: "Treatment updated successfully",
      treatment: updatedTreatment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating treatment",
      error: error.message,
    });
  }
};






export const FinalMedicineUpdate = async (req, res) => {

  const io = req.app.get("io");
  try {
    const { id } = req.params;
    let { 
      patientmedicine, 
      nOfDaysMedicine, 
      status, 
      discount, 
      totalPrice, 
      DueAmountPrice,
      payable,
      paymentHistory,
      
    } = req.body;

    if (!id) return res.status(400).json({ message: "Treatment ID is required" });

    const existingTreatment = await Treatment.findById(id);
    if (!existingTreatment) return res.status(404).json({ message: "Treatment not found" });
    const nOfDaysMedicineGet = nOfDaysMedicine || existingTreatment.nOfDaysMedicine || 5;
 
    const medicines = await Promise.all(
      (patientmedicine || []).map(async (med) => {
        const existingMed = existingTreatment.medicines.find((m) => m.name === med.name);

        let price = med.price ?? existingMed?.medicinePrice ?? existingMed?.price;
        if (!price) {
          const medicineDoc = await Medicine.findOne({ name: med.name });
          price = medicineDoc ? medicineDoc.price : 0;
        }

        const quantity = med.quantity ?? existingMed?.quantity ?? 0;
      


           await Medicine.findOneAndUpdate(
          { name: med.name },
          { $inc: { totalMediUsage: quantity } }
        );

        return {
          name: med.name,
          type: existingMed?.type ?? med.type ?? "Tablet",
          quantity,
          medicinePrice: price,
          dosageMl: med.dosageMl ?? existingMed?.dosageMl ?? null,
          times: med.times || existingMed?.times || {},
        };
      })
    );








    const updatedPaymentHistory = [...(existingTreatment.paymentHistory || []), paymentHistory];
  

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      id,
      {
        medicines,
        dispensed: true,
        status: status || "completed",
  
        nOfDaysMedicine: nOfDaysMedicineGet,
        totalPrice: totalPrice,
        discountPercent: discount,
        instructionsGiven:true,
        paymentStatus:DueAmountPrice ? 'Due' : "paid" ,
    payable:payable  ,
        DueAmountPrice: DueAmountPrice,
        paymentHistory: updatedPaymentHistory,
      },
      { new: true }
    );


          io.emit("completed", {  treatment:updatedTreatment });
    res.json({
      message: "✅ Treatment updated successfully",
      treatment: updatedTreatment,
    });
  } catch (error) {
    console.error("❌ FinalMedicineUpdate error:", error);
    res.status(500).json({
      message: "Error updating treatment",
      error: error.message,
    });
  }
};





// export const getBookingReport = async (req, res) => {
//   try {
//     let { startDate, endDate, status } = req.query;

//     const today = new Date();

//     // Agar startDate na diya ho → default last month se
//     if (!startDate) {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//       startDate = oneMonthAgo.toISOString().split("T")[0]; // YYYY-MM-DD
//     }

//     // Agar endDate na diya ho → default today
//     if (!endDate) {
//       endDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
//     }

//     // UTC me convert karke date range set karo
//     const start = new Date(startDate + "T00:00:00.000Z");
//     const end = new Date(endDate + "T23:59:59.999Z");

//     // Aggregation match
//     const match = { treatmentDate: { $gte: start, $lte: end } };
//     if (status) match.status = status;

//     // Report aggregation
//     const report = await Treatment.aggregate([
//       { $match: match },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$treatmentDate" } },
//           totalBookings: { $sum: 1 },
//           patients: { $push: "$patientId" }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     res.status(200).json(report);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// export const getBookingReport = async (req, res) => {
//   try {
//     let { startDate, endDate } = req.query;

//     const today = new Date();

//     // Default last 1 month
//     if (!startDate) {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//       startDate = oneMonthAgo.toISOString().split("T")[0];
//     }
//     if (!endDate) {
//       endDate = today.toISOString().split("T")[0];
//     }

//     const start = new Date(startDate + "T00:00:00.000Z");
//     const end = new Date(endDate + "T23:59:59.999Z");

//     // Sab treatments fetch karo
//     const treatments = await Treatment.find({
//       treatmentDate: { $gte: start, $lte: end },
//     });

//     // Date-wise count nikalna
//     const countByDate = {};

//     treatments.forEach(t => {
//       const dateKey = t.treatmentDate.toISOString().split("T")[0]; // YYYY-MM-DD
//       if (countByDate[dateKey]) {
//         countByDate[dateKey] += 1;
//       } else {
//         countByDate[dateKey] = 1;
//       }
//     });


//     // Object ko array me convert kar do sorted order me
//     const report = Object.keys(countByDate)
//       .sort()
//       .map(date => ({
//         date,
//         totalBookings: countByDate[date],
//       }));


//       console.log('data',report)
//     res.status(200).json(report);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const getBookingReport = async (req, res) => {
  try {
    // Frontend se query params
    const { startDate, endDate, status } = req.query;


    console.log('status find',status)
    // Agar frontend se date nahi diya to today se next 1 month
    let start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0); // start of day

    let end = endDate
      ? new Date(endDate)
      : new Date(new Date().setMonth(new Date().getMonth() + 1));
    end.setHours(23, 59, 59, 999); // end of day

    // Build filter
    const filter = {
      treatmentDate: { $gte: start, $lte: end },
    };
    if (status) filter.status = status;

    // Aggregation: group by date and count bookings
    const report = await Treatment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d",
               date: "$treatmentDate",
                    timezone: "Asia/Kolkata" // ✅ important

             },
          },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // ascending by date
    ]);

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report", error });
  }
};




