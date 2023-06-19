import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";

import { EnvNames } from "../enums/env.names";
import { getEnv } from "../helpers/env_helper";

const HOST = getEnv(EnvNames.HOST);

export const callback_dataListner = (bot: TelegramBot) => {
  // Listen for any kind of message. There are different kinds of messages.
  bot.on("callback_query", async (query: CallbackQuery) => {
    const chatId = query?.message?.chat.id;
    const text = query?.message?.text;
    const { data } = query;
    console.log("data", data);

    if (data?.includes("Hello")) {
      bot.answerCallbackQuery(query.id, {
        text: 'Button "Hello" clicked!',
      });
    }
  });
};
