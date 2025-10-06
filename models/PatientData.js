import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Patient name is required"],
    trim: true,
  },

    booking_mode: {
    type: String,
    enum:['online',"offline"]
  },
  dateOfBirth: {
    type: Date,
  },
    age: {
    type: Number,
    // required: [true, "Date of birth is required"],
  },
  reasonForVisit: {
    type: String,
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
    enum: ["Male", "Female", "Other", "Child"],
  },
status: {
  type: String,
  enum: ["new", "old","inactive"],
  default: "new",
},
    treatmentDate: {
    type: Date,
    required: true,
  },
  fixedPermanentId: { type: String, unique: true, },

}, {
  timestamps: true
});

const PatientModel = mongoose.model("Patient", patientSchema);
export default PatientModel
