const { InlineKeyboard } = require("grammy");

module.exports = {
  paymentKeyboard: new InlineKeyboard()
    .webApp("3 мес", "https://cryptogen.club/payment_3months")
    .webApp("🔥 1 год", "https://cryptogen.club/payment_1year"),

  goIntoKeyboard: new InlineKeyboard().text("🚀 Как попасть в клуб?", "payment6"),

  infoKeyboard: new InlineKeyboard()
    .text("✅ Теперь я готов!", "payment4")
    .row()
    .text("🧑‍🏫 Кто будет меня обучать?", "experts"),

  startKeyboard: new InlineKeyboard()
    .text("💪 Да, готов!", "payment2")
    .row()
    .text("ℹ️ Хочу узнать подробнее", "info"),

  helpLink: new InlineKeyboard().url(
    "❓ Задать вопрос",
    "https://t.me/cryptogensup"
  ),
};
