const dotenv = require("dotenv");
dotenv.config();
const pool = require("./createPool");

const connectDB = async () => {
    const client = null;
  try {
    await pool.connect();
    console.log("Connected successfully to the PostgreSQL database");
  } catch (err) {
    console.error(`Error connecting to the PostgreSQL database: ${err}`);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = connectDB;
