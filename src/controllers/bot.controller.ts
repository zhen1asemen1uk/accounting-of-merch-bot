import TelegramBot from "node-telegram-bot-api";
import { callback_dataListner } from "../services/callback_data.bot.service";
import { messageListner } from "../services/message.bot.service";
import { getEnv } from "../helpers/env_helper";
import { EnvNames } from "../enums/env.names";

const TELEGRAM_API_TOKEN = getEnv(EnvNames.TELEGRAM_API_TOKEN);

export const telegram_bot = () => {
  try {
    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(TELEGRAM_API_TOKEN!, { polling: true });

    messageListner(bot);
    callback_dataListner(bot);

    console.log("Bot started => ✅");
  } catch (error) {
    console.error(error);
  }
};
