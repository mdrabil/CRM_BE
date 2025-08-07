import PatientModel from "../models/PatientData.js";

const generateNextFixedPermanentId = async () => {
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

export default generateNextFixedPermanentId