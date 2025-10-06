import mongoose from "mongoose";
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
   permissions: {
    type: Map,
    of: [String], 
    default: {},
  }, // ['medicine:create', 'patient:update']

  status:{
    type:Boolean,default:true
  },
  urls: {
    type: [String], 
    default: []
  },

}, {
  timestamps: true // ⏰ Adds createdAt and updatedAt fields
});

const Role = mongoose.model('Role', roleSchema);
export default Role 
