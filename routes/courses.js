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

router.get("/enrolled/:code", async (req, res) => {
    const {code} = req.params
    try {
      const response = await client.query(`
      SELECT
      e.id, e.code_student, e.code_course,
      u.name AS name_student,
      c.name AS name_course
      FROM enrolled e
      INNER JOIN students s
        ON e.code_student = s.code
      INNER JOIN courses c
        ON e.code_course = c.code
      INNER JOIN users u
        ON s.id_user = u.id
      WHERE e.code_student = $1
            or e.code_course = $1`
      ,[code]);
      return res.status(200).json(response.rows);
    } catch (error) {
      res.status(500).json({error: error});
    }
  });

  router.delete("/enrolled/:code", async (req, res) => {
    const {code} = req.params
    try {
      const response = await client.query(`
      DELETE FROM enrolled
      WHERE code_student = $1
      `,[code]);
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  });



  router.post("/enrolled", async (req, res) => {
    const {code_student, code_course} = req.body
    console.log(code_student, code_course)
    try {
      const response = await client.query(`
        INSERT INTO enrolled (code_student, code_course)
        VALUES($1, $2)
        `
      ,[code_student, code_course]);
      res.status(201).json(response);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json("Already exists");
      } else {
        return res.status(500).json(error);
      }
    }
  });

  router.get('/assigned/:code', async(req, res)=>{
    const {code} = req.params
    try{
      const response = await client.query(`
      SELECT
      *
      FROM courses c
      WHERE c.code_professor = $1
      `, [code])
      return res.status(200).json(response.rows);
    }catch(error){
      return res.status(500).json(error)
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
