import { EnvNames } from "../enums/env-names";

export const getEnv = (enviromentName: EnvNames) =>
  process.env[enviromentName] ?? null;

export const isProd = getEnv(EnvNames.NODE_ENV) === EnvNames.NODE_ENV_PROD;
