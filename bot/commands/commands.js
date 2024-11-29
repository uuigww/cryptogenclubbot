const { InputFile, InlineKeyboard } = require("grammy");
const { Menu } = require("@grammyjs/menu");
const btn = require("./buttons")
const UserDB = require("../../db/dbMethods")

module.exports = (bot) => {
  try {
    bot.command("start", async (ctx) => {

      try {
        UserDB.addUser(ctx.message.from.id, ctx.message.from.username, ctx.match)
      } catch (error) {
        console.log(error)
      }

      await ctx.replyWithPhoto(new InputFile("./bot/media/start.png"), {
        caption: bot.msgs.start,
        parse_mode: "HTML",
        reply_markup: btn.startKeyboard,
      });
    });

    bot.command("help", async (ctx) => {
      await ctx.reply(bot.msgs.help, {
        parse_mode: "HTML",
        reply_markup: btn.helpLink,
      });
    });
  } catch (error) {
    console.log(error)
  }
};
