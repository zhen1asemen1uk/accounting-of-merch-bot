import { Schema, model } from "mongoose";

const eventSchema = new Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, reqirewd: true },
  gifted: { type: Boolean, default: false },
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
});

export const HolidayEvent = model("HolidayEvent", eventSchema);
