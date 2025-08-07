import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Patient name is required"],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    // required: [true, "Date of birth is required"],
  },
    age: {
    type: Number,
    // required: [true, "Date of birth is required"],
  },
  reasonForVisit: {
    type: String,
    required: [true, "This Filled is required"],

    // default: "",
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"],
  },
  status: {
    type: String,
    default: "new",
  },
    patientCode: {
    type: String,
    required: true,
  },
  fixedPermanentId: { type: String, unique: true, },

}, {
  timestamps: true
});

const PatientModel = mongoose.model("Patient", patientSchema);
export default PatientModel
