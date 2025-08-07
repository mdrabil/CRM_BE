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
import http from 'http'
import { Server } from 'socket.io';
dotenv.config();
connectDB();

const app = express();

// app.use(cors({
//     origin:''
// }))
app.use(cors())
app.use(express.json());
app.use(bodyParser.json())

const server = http.createServer(app)

// const io = require("socket.io")(server, {
//   cors: { origin: "*" },
// });

const io = new Server(server, {
  cors: {
    origin: '*', // Or set to your frontend URL
    methods: ['GET', 'POST']
  }
})


// io.on("connection", (socket) => {
//   console.log("New socket connected", socket.id);

//   socket.on("user_connected", (userId) => {
//       console.log("User joined room:", userId);

      
//     socket.join(userId); // Join room with user ID
//   });

//   socket.on("selected_patient", (data) => {
//     // Broadcast to all users OR a specific room
//     io.emit("receive_patient", data);
//   });

//   socket.on("user_disconnected", () => {
//     console.log("User disconnected:", socket.id);
//     socket.disconnect();
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });


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

    console.log("Connected users:", connectedUsers);
  });

  socket.on("selected_patient", (data) => {
    // console.log('selected data',data)
    io.emit("receive_patient", data);
  });

  socket.on("user_disconnected", () => {
    console.log("User manually disconnected:", socket.id);
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    for (const [userId, sockets] of connectedUsers.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} fully disconnected`);
      }
    }
    console.log("Remaining users:", connectedUsers);
  });
});



app.use("/api/medicines", medicineRoutes);
app.use("/api/admin",RolesRoutes);
app.use("/api/patients",PatientRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/treatments', TreatmentRoutes);
// In your main server file
app.set("io", io);

// In controller





const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
