const dotenv = require("dotenv");
dotenv.config();
const createUserTable = require("../schemas/userSchema");
const createBookingTable = require("../schemas/trainSchema");
const createTrainTable = require("../schemas/bookingSchema");
const pool = require("./createPool");

const connectDB = async () => {
    const client = null;
  try {
    const client = await pool.connect();
    createUserTable(client);
    createBookingTable(client);
    createTrainTable(client);
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
