async function createTrainTable(client) {
    const query = `
      CREATE TABLE IF NOT EXISTS trains(
          id SERIAL PRIMARY KEY,
          name varchar(255) NOT NULL UNIQUE,
          source varchar(255) NOT NULL,
          destination varchar(255) NOT NULL,
          seats_counter integer NOT NULL,
          seats_available integer NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
      )`;

      const index_query = `
      CREATE INDEX IF NOT EXISTS idx_train_src_dest ON trains(source,destination)`
  
    try {
      const result = await client.query(query);
      await client.query(index_query);
      if (result.command === 'CREATE') {
        console.log("Train table created successfully");
      } else {
        console.log("Train table already exists");
      }
    } catch (err) {
      console.error(`Error creating train table: ${err}`);
    }
  }
  
  module.exports = createTrainTable;
  