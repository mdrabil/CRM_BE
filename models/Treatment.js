

import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  medicinePrice: { type: Number },
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
const paymentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  type: { type: String, default: "offline" }, // cash/online/offline
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
totalPrice : {
  type :Number
},
payable: {
  type :Number
},
  paymentHistory: [paymentSchema], // ✅ New array
  paidAmount: { type: Number },

  discountPercent: { type: Number },
  dueAmountPrice: { type: Number },
  
    doctorName: { type: String },
    patinentProblem:{
      type:String,
    },
    // restrictions: [{ type: String }], 
    restrictions: { type: String }, 
    nOfDaysMedicine: { type: String }, 
    booking_mode:{
      type:String,
    },
        patientCode: { type: String },
    visitreason:{
      type:String,
    },
       symptoms:{
      type:String,
      
    },
        treatmentDate: {
    type: Date,
    required: true,
  },
  paymentStatus:{
    type:String,default:'upaid'
  },
    date: { type: Date, default: Date.now },
    status: {
  type: String,
  enum: ["pending", "checking_start", "checked_by_doctor", "medicines_dispensed", "completed"],
  default: "pending",
},
    medicines: [medicineSchema],
  },
  
  { timestamps: true }
);

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
