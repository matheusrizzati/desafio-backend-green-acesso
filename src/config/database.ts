import { Sequelize } from "sequelize";
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.DB_URL || "database",
    {
        dialect: "postgres",
        protocol: "postgres",
        logging: false
    }
)