import TelegramBot, {
  Message,
  KeyboardButton,
  InlineKeyboardButton,
} from "node-telegram-bot-api";
import moment from "moment";

import { BtnsBot } from "../enums/btns.bot";
import { EnvNames } from "../enums/env.names";
import { TriggersBot } from "../enums/triggers.bot";

import { User } from "../db/Schemas/User";

import { getEnv } from "../helpers/env_helper";
import { formattingListOfPeoples } from "../utils/formatting-list-of-peoples";
import { sendMessageInParts } from "../utils/send-message-in-parts";
import { Employee } from "../db/Schemas/Employee";
import { HolidayEvent } from "../db/Schemas/HolidayEvent";
import { ObjectId } from "mongodb";

// replace the value below with the Telegram TELEGRAM_API_TOKEN you receive from @BotFather

const HOST = getEnv(EnvNames.HOST);

export const messageListner = (bot: TelegramBot) => {
  // Listen for any kind of message. There are different kinds of messages.
  bot.onText(/\/start (.+)/, async (msg, match) => {
    const user = await User.findOne({ username: msg?.from?.username });

    if (!user) {
      await User.create({
        username: msg?.from?.username,
        fullName: msg?.from?.first_name,
        telegram_id: msg?.from?.id,
      });
    }

    return await bot.sendMessage(msg.chat.id, TriggersBot.HELLO, {
      reply_markup: {
        keyboard: [
          [{ text: BtnsBot.ADD_PEOPLE }],
          [{ text: TriggersBot.ADD_GIFTED_GIFT }],
          // [{ text: "Дай номерок", request_contact: true }],
          [{ text: BtnsBot.CHECK_ALL }],
          [{ text: BtnsBot.GIFTED }, { text: BtnsBot.NOT_GIFTED }],
        ],
      },
    });
  });

  const peoplePatternWithData = /(\W+ \W+\S\d{2}.\d{2}.(\d{4}|\d{2})\S)/gm;
  // bot.onText(peoplePatternWithData, async (msg, match) => {
  // });

  bot.on("message", async (msg: Message) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const peoplePattern = /^\W+ \W+$/gm;
    let isError: boolean = false;

    console.log(msg);
    switch (text) {
      case TriggersBot.GO_MAIN:
        return await bot.sendMessage(chatId, BtnsBot.MAIN, {
          reply_markup: {
            keyboard: [
              [{ text: BtnsBot.ADD_PEOPLE }],
              [{ text: BtnsBot.CHECK_ALL }],
              [{ text: BtnsBot.GIFTED }, { text: BtnsBot.NOT_GIFTED }],
            ],
          },
        });

      case BtnsBot.CHECK_ALL:
        const user = await User.findOne({
          username: msg?.from?.username,
        }).select("_id");

        const employee = await Employee.find({
          user: user?._id,
        });

        const result = await formattingListOfPeoples(employee);

        return await sendMessageInParts(bot, chatId, result);

      case BtnsBot.ADD_PEOPLE:
        return await bot.sendMessage(
          chatId,
          `
          Введіть призвище і ім'я(або через кому перелічіть людей, щоб додати кількох)
          
          Приклад: Семенюк Євген (31.05.1998), Сергієнко Ігор(07.07.1999), Кравцов Міша (11.11.11ʼ)
          `,
          {
            reply_markup: {
              keyboard: [[{ text: TriggersBot.GO_MAIN }]],
            },
          }
        );

      case TriggersBot.ADD_GIFTED_GIFT:
        return await bot.sendMessage(
          chatId,
          `Введіть прізвище і ім'я\nПриклад: Семенюк Євген`,
          {
            reply_markup: {
              keyboard: [[{ text: TriggersBot.GO_MAIN }]],
            },
          }
        );

      // case value:
      //   break;

      default:
        break;
    }

    if (text && peoplePatternWithData.test(text)) {
      isError = false;
      const arrBirthdates: (Date | undefined)[] = [];

      const rawArrNames = text?.split(",") || [];
      const birthdayPattern = /(\d{2}.\d{2}.(\d{4}|\d{2}))/gm;

      const arrNames = rawArrNames.map((el: string) => {
        const birthdate = el.match(birthdayPattern)?.[0];

        if (!birthdate) {
          isError = true;
          bot.sendMessage(
            chatId,
            `З "${el}" щось не так перерьте і надішліть знову весь текст з виправленнями`,
            {
              reply_markup: {
                keyboard: [[{ text: TriggersBot.GO_MAIN }]],
              },
            }
          );
          return el;
        }

        arrBirthdates.push(moment(birthdate, "DD.MM.YYYY").toDate());

        return el.replace(/\w*\S\d{2}.\d{2}.(\d{4}|\d{2})\S*/gm, "").trim();
      });

      const user = await User.findOne({
        username: msg?.from?.username,
      }).select("_id");

      if (!isError) {
        const holidayEventCreated = await HolidayEvent.create([
          {
            eventName: "День народження",
            employee: user?._id,
            eventDate: Date.now(),
          },
          {
            eventName: "1 рік в компанії",
            employee: user?._id,
            eventDate: Date.now(),
          },
          {
            eventName: "Новорічний подарунок",
            employee: user?._id,
            eventDate: Date.now(),
          },
        ]);

        await Employee.create(
          ...arrNames.map((el, i) => {
            return {
              fullName: el,
              birthdayDate: arrBirthdates[i],
              listGifts: holidayEventCreated[i]._id,
              user: user?._id,
            };
          })
        );

        const employee: InstanceType<typeof Employee>[] = [];

        // need refactor
        for await (const [index, name] of arrNames.entries()) {
          const items = await Employee.find({
            fullName: name,
            birthdayDate: arrBirthdates[index],
            user: user?._id.toString(),
          });

          const uniqueItems = items.filter(
            (empl) =>
              !employee.some(
                (empl2) => empl2._id.toString() === empl._id.toString()
              )
          );

          for (const item of uniqueItems) {
            employee.push(item);
          }
        }

        const result: string = formattingListOfPeoples(employee);

        return await sendMessageInParts(
          bot,
          chatId,
          employee.length > 0 ? `Ви додали:\n${result}` : result
        );
      }
    }

    if (text && peoplePattern.test(text)) {
      const user = await User.findOne({
        username: msg?.from?.username,
      }).select("_id");

      const employee = await Employee.find({
        user: user?._id.toString(),
        fullName: text,
      }).populate("listGifts");
      console.log("employee", employee);

      // for (let i = 0; i < employee.length; i++) {
      //   const objectsArray: InlineKeyboardButton[] = employee[i]?.listGifts.map(
      //     ({ _id, title, gifted }) => {
      //       return [
      //         {
      //           text: `${title} - ${gifted ? "✅" : "❌"}`,
      //           callback_data: {
      //             birthdayPeoples_id: employee[i]._id.toString(),
      //             gift_id: _id.toString(),
      //           },
      //         },
      //       ];
      //     }
      //   );

      //   const fullName = employee[i].fullName;
      //   const birthdayDate = moment(employee[i].birthdayDate).format(
      //     "DD.MM.YYYY"
      //   );

      //   await bot.sendMessage(chatId, `${fullName} (${birthdayDate})`, {
      //     reply_markup: {
      //       inline_keyboard: [objectsArray],
      //     },
      //   });
      // }

      const result =
        employee.length > 0
          ? `Знайдено ${employee.length} користувачів\nОберіть що йому подаровано`
          : `Користувача "${text}" не знайдено`;

      return await bot.sendMessage(chatId, result);
    }

    // if (text?.includes(TriggersBot.TEST)) {
    // return await bot.sendMessage(chatId, `${TriggersBot.TEST} - ✅`, {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [
    //         { text: "Кнопка 1", callback_data: "Hello" },
    //         { text: "Кнопка 1.2", callback_data: "Hello" },
    //         { text: "Кнопка 1.3", callback_data: "Hello" },
    //       ],
    //       [
    //         { text: "Кнопка 2", web_app: { url: HOST! } },
    //         { text: "Кнопка 2.2", web_app: { url: HOST! } },
    //         { text: "Кнопка 2.3", web_app: { url: HOST! } },
    //       ],
    //     ],
    //   },
    // });
    // }

    return bot.sendMessage(chatId, TriggersBot.UNEXPECTED_COMMAND);
  });
};
