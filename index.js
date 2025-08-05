import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import connectDB from './DB/ConnectDB.js';
// const medicineRoutes = require("./routes/medicineRoutes");
import medicineRoutes from "./routes/MedicineRoutes.js";
import RolesRoutes from "./routes/UserRoute.js";
import PatientRoutes from "./routes/PatientRoute.js";
import AuthRoutes from "./routes/authRoutes.js";
import TreatmentRoutes from "./routes/TreatmentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// app.use(cors({
//     origin:''
// }))
app.use(cors())
app.use(express.json());
app.use(bodyParser.json())




app.use("/api/medicines", medicineRoutes);
app.use("/api/admin",RolesRoutes);
app.use("/api/patients",PatientRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/treatments', TreatmentRoutes);




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
