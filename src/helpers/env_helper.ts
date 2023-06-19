import { EnvNames } from "../enums/env.names";

export const getEnv = (enviromentName: EnvNames) => {
  if (enviromentName) {
    return process.env[enviromentName];
  } else {
    throw new Error(`Error .env => ${enviromentName}`);
  }
};
