import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
         type: String,
          required: true 
        },
    type:
     { type: String,
         required: true
         }, // e.g., "Tablet", "Syrup"
    price:
     { type: Number,
         required: true
         },
    quantity: 
    { type: Number, required: true 

    },
    mfgDate:
     { type: Date,
         required: true
         },
    expireDate:
     { type: Date,
         required: true 
        },
    status:
    { type: Boolean,
         default: true

      },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
