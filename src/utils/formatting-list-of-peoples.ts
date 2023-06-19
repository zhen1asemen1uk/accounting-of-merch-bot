import moment from "moment";
import InstanceType from "mongoose";

import { Employee } from "../db/Schemas/Employee";
import { HolidayEvent } from "../db/Schemas/HolidayEvent";

export const formattingListOfPeoples = (
  employees: InstanceType<typeof Employee>[]
): string => {
  let result = "Не знайдено користувачів";

  if (employees.length > 0) {
    // get "mainText" and "employee_id"
    const arrId = employees.map((el, i) => {
      const mainText = `${i + 1}. ${el.fullName} - ${moment(
        el.birthdayDate
      ).format("DD.MM.YYYY")}`;

      return { mainText: mainText, employee_id: el._id };
    });

    const listGiftsData = arrId.map(async (el) => {
      const listGifts: InstanceType<typeof HolidayEvent>[] =
        await HolidayEvent.find({ employee: el.employee_id });

      return listGifts;
    });

    // get "listGifts" and formatting
    result = `${arrId
      .map((el) => {
        const eventText = listGiftsData
          .map((event) => {
            const eventName = event.eventName!;
            const gifted = event.gifted!;

            return `${eventName} - ${gifted ? "✅" : "❌"}`;
          })
          .join("\n");

        return `${el.mainText}\n${eventText}`;
      })
      .join("\n\n")}`;
  }

  return result;
};
