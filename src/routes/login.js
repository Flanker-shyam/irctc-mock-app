const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const validator = require("../validations/schemaValidators");
const pool = require("../database/createPool");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(helmet());
router.use(express.json());

router.post("/", async (req, res) => {
  const { error } = validator.validateLoginData(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const client = await pool.connect();
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await client.query(query, [req.body.email]);
    const foundUser = rows[0];

    if (foundUser) {
      bcrypt.compare(
        req.body.password,
        foundUser.password,
        function (err, result) {
          if (!err) {
            if (result === true) {
              const token = jsonwebtoken.sign(
                {
                  User: foundUser.email,
                },
                process.env.JWT_SECRET
              );
              res.setHeader("Authorization", `Bearer ${token}`);
              res.status(200).send("User login successfully");
              return;
            } else {
              res.status(400).send("Invalid password, please retry");
              return;
            }
          } else {
            res
              .status(500)
              .send("Internal server error during password comparison");
          }
        }
      );
    } else {
      res.status(400).send("User not found, please register");
      return;
    }
  } catch (err) {
    console.error(`Error logging in user: ${err}`);
    res.status(500).send("Internal server error: ", err.message);
  } finally {
    client.release();
  }
});

module.exports = router;
