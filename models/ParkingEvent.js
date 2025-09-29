// models/ParkingEvent.js
import mongoose from "mongoose";

const parkingEventSchema = new mongoose.Schema({
  event_id: Number,
  entry_time: Date,
  exit_time: Date,
  vehicle_type: String,
  parking_spot: String,
  location: String,
  duration_minutes: Number,
  fee_amount: Number,
  payment_method: String,
  user_type: String
});

export const ParkingEvent = mongoose.model("ParkingEvent", parkingEventSchema);
