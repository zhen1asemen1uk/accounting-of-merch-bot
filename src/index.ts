import { getEnv } from "./helpers/env_helper";
import { startDb } from "./db/mongodb";

import express from "express";
import "./helpers/dotenv-loader";
import { telegram_bot } from "./controllers/bot.controller";
import { EnvNames } from "./enums/env.names";

const app = express();

const HOST = getEnv(EnvNames.HOST);
const PORT = getEnv(EnvNames.PORT);

startDb();
// telegram_bot();
telegram_bot();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started => http://${HOST}:${PORT} ✅`);
});
