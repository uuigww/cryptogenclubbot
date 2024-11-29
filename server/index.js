// server/index.js
const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");

const app = express();

// Middleware для парсинга JSON
app.use(bodyParser.json());

/* // Регистрируем маршруты
app.use("/api", apiRoutes); */

// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
