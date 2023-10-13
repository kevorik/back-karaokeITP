import { log } from "console";
import { ConfigService } from "@nestjs/config";
export function GeterateDBuri(config: ConfigService) {
  const dbConfig = {
    user: config.get<string>("MNG_DB_USER"),
    pass: config.get<string>("MNG_DB_PASS"),
    host: config.get<string>("MNG_DB_HOST"),
    port: config.get<string>("MNG_DB_PORT"),
    db: config.get<string>("MNG_DB_NAME"),
  };

  return `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${dbConfig.db}?authSource=${dbConfig.db}`;
}

export default GeterateDBuri;
