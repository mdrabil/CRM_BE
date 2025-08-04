import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  password:{
    type:String
  },
  customPermissions: {
    type: Map,
    of: [String], // Module-wise permissions like role
    default: {}
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
