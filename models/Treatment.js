

import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  dosageMl: { type: Number }, // Only for Syrup
  type: { type: String, enum: ["Tablet", "Syrup", "Injection"] },
  times: {
    सुबह: {
      beforeMeal: { type: Boolean, default: false },
      afterMeal: { type: Boolean, default: false },
    },
    दोपहर: {
      beforeMeal: { type: Boolean, default: false },
      afterMeal: { type: Boolean, default: false },
    },
    रात: {
      beforeMeal: { type: Boolean, default: false },
      afterMeal: { type: Boolean, default: false },
    },
  },
  date: { type: Date, default: Date.now },
});

const treatmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    dispensed: { type: Boolean, default: false }, // Pharmacy marks true when medicine given
instructionsGiven: { type: Boolean, default: false }, // Main counter marks true

    doctorName: { type: String },
    patinentProblem:{
      type:String,
    },

    todaybooking_mode:{
      type:String,
    },
        todayPatientcode: { type: String },
    todayvisitreason:{
      type:String,
    },
       symptoms:{
      type:String,
      
    },
    date: { type: Date, default: Date.now },
    medicines: [medicineSchema],
  },
  
  { timestamps: true }
);

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
