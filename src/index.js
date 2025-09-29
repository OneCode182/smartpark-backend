import express from 'express';
import apiRoutes from '../routes/api.routes.js';
import parkingRoutes from '../routes/parking.routes.js';
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

// CONFIG
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ROUTES
app.use(apiRoutes);  
app.use(parkingRoutes); 

// DB CONNECTION
connectDB();

// LISTEN
app.listen(PORT, () => {
    console.log(`Server listen in http://localhost:${PORT}`);
});