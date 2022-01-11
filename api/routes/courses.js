var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM courses`);
    return res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/enrolled/:student", async (req, res) => {
    const {student} = req.params
    try {
      const response = await client.query(`SELECT code_course FROM enrolled WHERE code_student = ${student}`);
      return res.status(200).json(response.rows);
    } catch (error) {
      res.status(500).json(error);
    }
  });

router.post("/", async (req, res) => {
  let { code, name, credits, id_campus, code_professor } = req.body;
  try {
    const create = await client.query(
      `INSERT INTO courses(code, name, credits, code_professor, id_campus) VALUES ($1, $2, $3, $4, $5)`,
      [code, name, credits, code_professor, id_campus]
    );
    res.status(201).json(create);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json("Already exists");
    } else {
      return res.status(500).json(error);
    }
  }
});

router.delete("/:code", (req, res) => {
  const { code } = req.params;
  try {
    const deleted = client.query("DELETE FROM courses WHERE code=$1", [code]);
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put("/:code", (req, res) => {
  const { code } = req.params;
  let { name, credits, id_campus, code_professor } = req.body;

  try {
    const update = client.query(
        `UPDATE courses
        SET name = $1,
        credits = $2,
        id_campus = $3,
        code_professor = $4
        WHERE code = $5
        `,
      [name, credits, id_campus, code_professor, code]
    );
    return res.status(200).json(update);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
