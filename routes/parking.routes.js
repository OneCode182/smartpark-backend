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



// ✅ GET: traer un evento por ID
router.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await ParkingEvent.findOne({ event_id: Number(id) });

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("❌ Error al obtener evento por ID:", error.message);
    res.status(500).json({ error: "No se pudo obtener el evento" });
  }
});





// ✅ POST: Crear un evento individual (duration calculado automáticamente)
router.post("/api/events", async (req, res) => {
  try {
    // Encontrar el ID máximo actual
    const lastEvent = await ParkingEvent.findOne().sort({ event_id: -1 }).exec();
    const nextId = lastEvent ? lastEvent.event_id + 1 : 1; // si no hay eventos, arranca en 1

    // Convertir a Date
    const entryTime = new Date(req.body.entry_time);
    const exitTime = new Date(req.body.exit_time);

    // Calcular duración en minutos
    const durationMinutes = Math.round((exitTime - entryTime) / (1000 * 60));

    const newEvent = new ParkingEvent({
      event_id: nextId,
      entry_time: entryTime,
      exit_time: exitTime,
      vehicle_type: req.body.vehicle_type,
      parking_spot: req.body.parking_spot,
      location: req.body.location,
      duration_minutes: durationMinutes, // calculado automáticamente
      fee_amount: req.body.fee_amount,
      payment_method: req.body.payment_method,
      user_type: req.body.user_type,
    });

    const savedEvent = await newEvent.save();

    // 🔄 devolver el JSON ya con duration calculado
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("❌ Error al crear evento:", error.message);
    res.status(500).json({ error: "No se pudo crear el evento" });
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



// ✅ DELETE: eliminar un evento por ID
router.delete("/api/events/:id", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);

    const deletedEvent = await ParkingEvent.findOneAndDelete({ event_id: eventId });

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "✅ Event deleted successfully", deletedEvent });
  } catch (error) {
    console.error("❌ Error deleting event:", error.message);
    res.status(500).json({ error: "Failed to delete event" });
  }
});






export default router;
