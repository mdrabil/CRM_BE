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
    of: [String], 
    default: {}
  }
  , status: {
      type: Boolean,
      default: true 
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
