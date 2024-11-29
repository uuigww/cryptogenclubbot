const bot = require("./bot");
const { registerCommands  } = require("./commands/initCommands");
const { inlineHandler } = require("./commands/inlineHandler");

registerCommands(bot);
bot.on("callback_query:data", ctx => inlineHandler(ctx, bot));

bot
  .start()
  .then(() => {
    console.log("Bot started successfully!");
  })
  .catch((error) => {
    console.error("Error starting bot:", error);
  });
