const { Bot } = require('grammy');
require("dotenv").config();

const bot = new Bot(process.env.botToken);

bot.msgs = require("./messages.json");

module.exports = bot;
