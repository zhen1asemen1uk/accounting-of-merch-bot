import { Date, Schema } from "mongoose";

export interface IEmployee {
  fullName: string;
  birthdayDate: Date;
  listGifts: { type: Schema.Types.ObjectId; ref: "HolidayEvent" }[];
  user: { type: Schema.Types.ObjectId; ref: "User" };
}

