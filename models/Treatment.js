

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

    dispensed: { type: Boolean, default: false }, 
instructionsGiven: { type: Boolean, default: false }, 

    doctorName: { type: String },
    patinentProblem:{
      type:String,
    },
    // restrictions: [{ type: String }], 
    restrictions: { type: String }, 
    todaybooking_mode:{
      type:String,
    },
        Patientcode: { type: String },
    visitreason:{
      type:String,
    },
       symptoms:{
      type:String,
      
    },
    date: { type: Date, default: Date.now },
    status: {
  type: String,
  enum: ["Pending", "checking_start", "checked_by_doctor", "medicines_dispensed", "completed"],
  default: "Pending",
},
    medicines: [medicineSchema],
  },
  
  { timestamps: true }
);

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
