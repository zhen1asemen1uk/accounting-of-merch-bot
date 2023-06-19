import TelegramBot from "node-telegram-bot-api";

export const sendMessageInParts = async (
  bot: TelegramBot,
  chatId: number,
  message: string
) => {
  const maxMessageLength = 4096; // Максимально допустима довжина повідомлення

  for (let i = 0; i < message.length; i += maxMessageLength) {
    const currentPart = message.substring(i, i + maxMessageLength);

    await bot.sendMessage(chatId, currentPart, {
      reply_markup: {
        keyboard: [[{ text: "На головну" }]],
      },
    });
  }
};
