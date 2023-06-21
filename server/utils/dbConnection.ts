// const config = require("./config");
import { config } from "./config";
import { Pool } from "pg";

export const pool = new Pool({
  user: config.POSTGRES_USER,
  host: config.PGHOST,
  database: config.POSTGRES_DB,
  password: config.PGADMIN_DEFAULT_PASSWORD,
  port: config.PGPORT,
});

export const connectDB = () => {
  pool.connect((err, _client, _release) => {
    if (err) {
      console.log("Error acquiring client", err.stack);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectDB, 5000);
    } else {
      console.log(`Connected to database ${config.POSTGRES_DB}`);
    }
  });
};

// export = {
//   pool,
//   connectDB,
// };
