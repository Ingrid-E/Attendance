var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM users`);
    return res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const response = await client.query(
      `SELECT * FROM users WHERE username = '${username}'`
    );
    if (response.rowCount == 0)
      return res.status(404).json({ error: "No existe" });
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  let { id, name, username, address, password } = req.body;
  try {
    const create = await client.query(
      `INSERT INTO users(id, name, username, address, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, name, username, address, password]
    );
    res.status(201).json({ message: "Created User" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json("Already exists");
    } else {
      return res.status(500).json(error);
    }
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    client.query("DELETE FROM users WHERE id=$1", [id]);
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:user", (req, res) => {
  const { user } = req.params;
  const { id, name, username, address, password } = req.body;

  try {
    const update = client.query(
      `UPDATE users
        SET id = $1,
        name = $2,
        username = $3,
        address = $4
        password = $5
        WHERE id = $6
        `,
      [id, name, username, address, password, user]
    );
    return res.status(200).json(update);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
