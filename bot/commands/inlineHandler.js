const btn = require("./buttons");
const { InputFile } = require("grammy");
const msgs = require("../messages.json");
const UserDB = require("../../db/dbMethods");

const inlineHandler = async (ctx, bot) => {
  try {
    const data = ctx.update.callback_query.data;
    const userId = ctx.update.callback_query.from.id;

    if (data.startsWith("payment")) {
      await bot.api.sendPhoto(
        userId,
        new InputFile("./bot/media/payment.png"),
        {
          caption: msgs.payment,
          parse_mode: "HTML",
          reply_markup: btn.paymentKeyboard,
        }
      );

      await ctx.answerCallbackQuery();

      const newActivity = parseInt(data.slice("payment".length).trim());
      UserDB.updateActivity(userId, newActivity);
    } else {
      switch (data) {
        /* case "payment":
        await bot.api.sendPhoto(userId ,new InputFile("./bot/media/payment.png"), {
          caption: msgs.payment,
          parse_mode: "HTML",
          reply_markup: btn.paymentKeyboard,
        });

        await ctx.answerCallbackQuery();
        break; */
        case "experts":
          await bot.api.sendPhoto(
            userId,
            new InputFile("./bot/media/experts.png"),
            {
              caption: msgs.experts,
              parse_mode: "HTML",
              reply_markup: btn.goIntoKeyboard,
            }
          );

          await ctx.answerCallbackQuery();

          UserDB.updateActivity(userId, 5);
          break;
        case "info":
          await bot.api.sendPhoto(
            userId,
            new InputFile("./bot/media/info.png"),
            {
              caption: msgs.info,
              parse_mode: "HTML",
              reply_markup: btn.infoKeyboard,
            }
          );

          await ctx.answerCallbackQuery();
          UserDB.updateActivity(userId, 3);
          break;

        default:
          await ctx.answerCallbackQuery("😵‍💫 Что-то не так");
          break;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { inlineHandler };
