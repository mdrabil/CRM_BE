import PatientModel from "../models/PatientData.js";
import Treatment from "../models/Treatment.js";

export const generateNextFixedPermanentId = async () => {
  const total = await PatientModel.countDocuments();
  let newId = total + 1;
  let fixedId;

  // Retry logic to ensure uniqueness
  while (true) {
    fixedId = `PNo-${newId.toString().padStart(4, '0')}`;
    const exists = await PatientModel.findOne({ fixedPermanentId: fixedId });
    if (!exists) break;
    newId++;
  }

  return fixedId;
};




export const generateNextTreatmentNO = async () => {
  const total = await Treatment.countDocuments();
  let newNo = total + 1;
  let fixedNo;

  // Retry logic to ensure uniqueness
  while (true) {
    fixedNo = `TrNo-${newNo.toString().padStart(4, '0')}`;
    const exists = await Treatment.findOne({ treatmentNo: fixedNo });
    if (!exists) break;
    newNo++;
  }

  return fixedNo; // ✅ yahan fixedId nahi, fixedNo return karna hai
};


