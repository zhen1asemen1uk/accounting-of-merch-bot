import mongoose from "mongoose";

import { getEnv } from "../helpers/env_helper";
import "../helpers/dotenv-loader";
import { EnvNames } from "../enums/env.names";

const DB_LOGIN = getEnv(EnvNames.DB_LOGIN);
const DB_PASS = getEnv(EnvNames.DB_PASS);
const DB_HOST = getEnv(EnvNames.DB_HOST);

const dbUri = `mongodb+srv://${DB_LOGIN}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority`;

export const startDb = async () => {
  try {
    mongoose.connect(dbUri);
    console.log("DB started => ✅");
  } catch (error) {
    console.log(`DB error => ❌`);
    console.error(error);
  }
};
