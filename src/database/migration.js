const {Client} = require('pg');
require('dotenv').config();
const userSchema = require("../schemas/userSchema");
const trainSchema = require("../schemas/trainSchema");
const bookingSchema = require("../schemas/bookingSchema");
const { ExitStatus } = require('typescript');


async function migrate(){
    const client = new Client({
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        database: process.env.DATABASE,
        port: process.env.DB_PORT,
    });

    console.info("Migrating...")

    try{
        await client.connect();
        const dropQueryTrain = `DROP TABLE IF EXISTS trains`;   
        const dropQueryUser = `DROP TABLE IF EXISTS users`;
        const dropQueryBooking = `DROP TABLE IF EXISTS bookings`;

        console.info("Dropping Table trains...");
        await client.query(dropQueryTrain);
        console.info("Dropping Table users...");
        await client.query(dropQueryUser);
        console.info("Dropping Table bookings...");
        await client.query(dropQueryBooking);

        console.info("Creating Table trains...");
        await trainSchema(client);
        console.info("Creating Table users...");
        await userSchema(client);
        console.info("Creating Table bookings...");
        await bookingSchema(client);
    }
    catch(err){
        console.log(`Error while performing Migration: ${err}`);
    }
    finally{
        await client.end();
    }
}

migrate();