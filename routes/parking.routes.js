import { Router } from 'express';
import { ParkingEvent } from "../models/ParkingEvent.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";



const router = Router();



// ✅ GET: traer todos los eventos
router.get("/api/events", async (req, res) => {
  try {
    const events = await ParkingEvent.find().sort({ event_id: 1 }); // ordenados por ID
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Error al obtener eventos:", error.message);
    res.status(500).json({ error: "No se pudieron obtener los eventos" });
  }
});





// 📥 POST: Cargar eventos desde el CSV y guardarlos
router.post("/api/events/load", async (req, res) => {
  try {
    const csvPath = path.join(process.cwd(), "data", "events.csv");

    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: "Archivo CSV no encontrado" });
    }

    const events = [];

    // ✅ Leer el CSV e ignorar la primera línea (header)
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        // Convertir tipos
        events.push({
          event_id: Number(row.event_id),
          entry_time: new Date(row.entry_time),
          exit_time: new Date(row.exit_time),
          vehicle_type: row.vehicle_type,
          parking_spot: row.parking_spot,
          location: row.location,
          duration_minutes: Number(row.duration_minutes),
          fee_amount: Number(row.fee_amount),
          payment_method: row.payment_method,
          user_type: row.user_type,
        });
      })
      .on("end", async () => {
        // Insertar en MongoDB
        const result = await ParkingEvent.insertMany(events, { ordered: false });
        res.status(201).json({ message: "✅ Eventos insertados", count: result.length });
      });
  } catch (error) {
    console.error("❌ Error cargando CSV:", error.message);
    res.status(500).json({ error: "Error cargando datos desde el CSV" });
  }
});




export default router;
