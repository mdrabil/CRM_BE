import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import connectDB from './DB/connectDB.js';
// const medicineRoutes = require("./routes/medicineRoutes");
import medicineRoutes from "./routes/MedicineRoutes.js";
import RolesRoutes from "./routes/RolesRoute.js";
import PatientRoutes from "./routes/PatientRoute.js";
import AuthRoutes from "./routes/authRoutes.js";
import TreatmentRoutes from "./routes/TreatmentRoutes.js";
import UsersRoutes from "./routes/UserRoute.js";
import http from 'http'
import { Server } from 'socket.io';
dotenv.config();
connectDB();
// const db connet 
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://crm-fr-nine.vercel.app', 
  ],
  credentials: true
}));

// app.use(cors({
//   origin: '*', // testing purpose
//   methods: ['GET','POST','PUT','DELETE'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));



app.use(express.json());
app.use(bodyParser.json())
app.get('/',(req,res)=>{
  res.send('api runing')
})
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', // Or set to your frontend URL
    methods: ['GET', 'POST']
  }
})




const connectedUsers = new Map(); // userId => Set of socketIds

io.on("connection", (socket) => {
  console.log("New socket connected", socket.id);

  socket.on("user_connected", (userId) => {
    console.log("User joined room:", userId);
    socket.join(userId);

    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);

    // console.log("Connected users:", connectedUsers);
  });

  socket.on("selected_patient", (data) => {
    console.log('selected data',data)
    io.emit("receive_patient", data);
  });

  socket.on("user_disconnected", () => {
    // console.log("User manually disconnected:", socket.id);
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    // console.log("Socket disconnected:", socket.id);
    for (const [userId, sockets] of connectedUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        connectedUsers.delete(userId);
        // console.log(`User ${userId} fully disconnected`);
      }
    }
    // console.log("Remaining users:", connectedUsers);
  });
});



app.use("/api/medicines", medicineRoutes);
app.use("/api/admin",RolesRoutes);
app.use("/api/patients",PatientRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/treatments', TreatmentRoutes);
app.use('/api/users', UsersRoutes);
// app.use('/api/roles', RolesRoutes);
// In your main server file
app.set("io", io);

// In controller
// If using reverse proxy in future:
// app.set('trust proxy', true);
app.set('trust proxy', true)

const PORT = process.env.PORT || 8000;
server.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
// server.listen(PORT, '0.0.0.0', () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );






// === DIAGNOSTIC LOGGER: add this BEFORE routes ===
// app.use((req, res, next) => {
//   const ipRaw = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
//   const ip = (ipRaw + '').replace('::ffff:', '');
//   console.log('=== Incoming Request ===');
//   console.log('Time:', new Date().toISOString());
//   console.log('Method:', req.method, 'Path:', req.originalUrl);
//   console.log('Client IP raw:', ipRaw);
//   console.log('Client IP parsed:', ip);
//   console.log('Headers x-forwarded-for:', req.headers['x-forwarded-for']);
//   console.log('Host header:', req.headers.host);
//   console.log('========================');
//   next();
// });
// ==



// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

