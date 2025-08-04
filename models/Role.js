import mongoose from "mongoose";
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
   permissions: {
    type: Map,
    of: [String], // example: { 'package': ['create', 'read'] }
    default: {},
  }, // ['medicine:create', 'patient:update']
}, {
  timestamps: true // ⏰ Adds createdAt and updatedAt fields
});

const Role = mongoose.model('Role', roleSchema);
export default Role 
