const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const saltRounds = 10;
const router = express.Router();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const validator = require("../validations/schemaValidators");
require("dotenv").config();
const pool = require("../database/createPool");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(helmet());
router.use(express.json());

router.post("/", async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      const { error } = validator.validateRegisterData(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const query = `
      INSERT INTO users(name,email,password)
      VALUES($1,$2,$3)
      `;
      const values = [req.body.name, req.body.email, hash];

      const client = await pool.connect();
      try {
        await client.query(query, values);
        console.log("User added successfully");
        const token = jsonwebtoken.sign(
          {
            email: req.body.email,
          },
          process.env.JWT_SECRET
        );
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).send("User added successfully");
      } catch (err) {
        console.error(`Error adding user: ${err}`);
      } finally {
        client.release();
      }
    }
  });
});

module.exports = router;
