import TelegramBot, { Message } from "node-telegram-bot-api";
import dotenv from "dotenv";
import { EnvNames } from "./enums/env-names";
import { getEnv, isProd } from "./helpers/env_helper";

if (isProd) {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

// replace the value below with the Telegram TELEGRAM_API_TOKEN you receive from @BotFather
const TELEGRAM_API_TOKEN = getEnv(EnvNames.TELEGRAM_API_TOKEN);
const HOST = getEnv(EnvNames.HOST);

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TELEGRAM_API_TOKEN!, { polling: true });

// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async (msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // await bot.sendMessage(chatId, "Почалося!", {
  //   reply_markup: {
  //     keyboard: [[{ text: "Почати" }]],
  //   },
  // });

  if (text?.includes("/start")) {
    await bot.sendMessage(chatId, "Привіт 👋🏻", {
      reply_markup: {
        keyboard: [
          [{ text: "Додати людину" }],
          [{ text: "Перевірити все" }],
          [{ text: "Подарено" }, { text: "Не подарено" }],
        ],
      },
    });
  }

  if (text?.includes("Почати_2")) {
    await bot.sendMessage(chatId, "Почалося_2 !", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Кнопка 1", web_app: { url: HOST! } },
            { text: "Кнопка 1.2", web_app: { url: HOST! } },
            { text: "Кнопка 1.3", web_app: { url: HOST! } },
          ],
          [
            { text: "Кнопка 2", web_app: { url: HOST! } },
            { text: "Кнопка 2.2", web_app: { url: HOST! } },
            { text: "Кнопка 2.3", web_app: { url: HOST! } },
          ],
        ],
      },
    });
  }

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});
