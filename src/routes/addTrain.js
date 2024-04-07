const express = require("express");
const router = express.Router();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const validator = require("../validations/schemaValidators");
const pool = require("../database/createPool");
const adminAuth = require("../middlewares/adminAuth");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(helmet());
router.use(express.json());

router.post("/", adminAuth, async (req, res) => {
  const { error } = validator.validateTrainData(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const client = await pool.connect();
  try {
    const query = `INSERT INTO trains(name, source, destination, seats_counter, seats_available)
    VALUES($1,$2,$3,$4,$5)`;

    const values = [
      req.body.name,
      req.body.source,
      req.body.destination,
      req.body.seats_counter,
      req.body.seats_available,
    ];

    await client.query(query, values);
    console.log("Train added successfully");
    res.status(200).send("Train added successfully");
  } catch (err) {
    console.error(`Error adding new train: ${err}`);
    res.status(500).send(`Internal server error while adding trains: ${err.message} `);
  } finally {
    client.release();
  }
});

module.exports = router;
