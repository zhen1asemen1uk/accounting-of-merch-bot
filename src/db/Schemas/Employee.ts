import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    birthdayDate: { type: Date, required: true },
    listGifts: [{ type: Schema.Types.ObjectId, ref: "HolidayEvent" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Employee = model("Employee", employeeSchema);
