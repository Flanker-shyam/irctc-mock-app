async function createBookingTable(client) {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        train_id integer NOT NULL REFERENCES trains(id),
        seats VARCHAR(5) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        user_id SERIAL NOT NULL REFERENCES users(id)
    )`;

  try {
    await client.query(query);
    console.log("Booking table created successfully");
  } catch (err) {
    console.error(`Error creating booking table: ${err}`);
  }
}

module.exports=createBookingTable
