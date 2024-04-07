async function createUserTable(client) {
  const query = `
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email varchar(255) NOT NULL,
        password varchar(255)NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`;

  try {
    await client.query(query);
    console.log("User table created successfully");
  } catch (err) {
    console.error(`Error creating user table: ${err}`);
  }
}

module.exports = createUserTable;
