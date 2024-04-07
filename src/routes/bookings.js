const express = require("express");
const router = express.Router();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userAuth = require("../middlewares/userAuth");
const pool = require("../database/createPool");
const validator = require("../validations/schemaValidators");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(helmet());
router.use(express.json());

router.get("/", userAuth, async (req, res) => {
  const { error } = validator.validateUserData(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const client = await pool.connect();
  try {
    const query = `SELECT users.name, trains.name as train_name, trains.source, trains.destination, bookings.created_at as booked_at, bookings.seats
    FROM bookings
    JOIN trains ON bookings.train_id = trains.id
    JOIN users ON bookings.user_id = users.id
    WHERE users.email = $1`;

    const { rows } = await client.query(query, [req.body.email]);
    if (rows.length === 0) {
      res.status(404).send("No bookings found for the user");
      return;
    } else {
      res.status(200).send(rows);
    }
  } catch (err) {
    console.error(`Error getting booking records: ${err}`);
    res.status(500).send("Error getting booking record: ", err.message);
  }
});

module.exports = router;

