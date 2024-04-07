const express = require("express");
const router = express.Router();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const validator = require("../validations/schemaValidators");
const userAuth = require("../middlewares/userAuth");
const pool = require("../database/createPool");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(helmet());
router.use(express.json());

router.get("/", userAuth, async (req, res) => {
  const { error } = validator.validateGetTrainData(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const source = req.body.source;
  const destination = req.body.destination;

  const client = await pool.connect();
  try {
    const query = `SELECT trains.id, trains.name, trains.source, trains.destination, trains.seats_available FROM trains WHERE source = $1 AND destination = $2`;
    const { rows } = await client.query(query, [source, destination]);
    if (rows.length === 0) {
      res.status(200).send("No trains available for the specified route");
      return;
    } else {
      res.status(200).send(rows);
    }
  } catch (err) {
    console.error(`Error getting train data: ${err}`);
    res.status(500).send("Error getting trains: ", err.message);
  }
});

router.post("/", userAuth, async (req, res) => {
  const { error } = validator.validateBookingData(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const client = await pool.connect();
  try {
    const getTrainQuery = `SELECT * FROM trains WHERE id = $1`;
    const { rows } = await client.query(getTrainQuery, [req.body.train_id]);
    const train = rows[0];
    if (!train) {
      res.status(400).send("Train not found, kindly enter a valid train id");
      return;
    }
    if (train.seats_available - req.body.seats < 0) {
      res
        .status(400)
        .send(
          `${req.body.seats} number of seats are not available for this train chose a different train`
        );
      return;
    }

    client.query("BEGIN");
    const updateTrainQuery = `UPDATE trains SET seats_available = $1, seats_counter = $2 WHERE id = $3`;
    const updateValues = [
      train.seats_available - req.body.seats,
      train.seats_counter + req.body.seats,
      req.body.train_id,
    ];
    const bookingQuery = `INSERT INTO bookings(train_id, seats, user_id) VALUES($1,$2,$3)`;
    const seat_num = `${train.seats_counter+1}-${
      train.seats_counter + req.body.seats
    }`;
    const bookingValues = [req.body.train_id, seat_num, req.body.user_id];
    client.query(updateTrainQuery, updateValues);
    client.query(bookingQuery, bookingValues);
    client.query("COMMIT");
    res.status(200).send("Train booked successfully");
  } catch (err) {
    console.error(`Error booking seats: ${err}`);
    res
      .status(500)
      .send("Internal server error while booking seats: ", err.message);
  } finally {
    client.release();
  }
});

module.exports = router;
