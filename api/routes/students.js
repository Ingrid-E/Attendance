var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
    try {
      const response = await client.query(`SELECT * FROM students s INNER JOIN users u ON s.id_user = u.id`);
      return res.status(200).json(response.rows);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.get('/:student', async function(req,res){
    const {student} = req.params
    try{
      const response = await client.query(`SELECT * FROM students WHERE id_user = $1 or code=$1`, [student])
      if(response.rowCount == 0) res.status(404).send('No existe')
      else res.status(200).json(response.rows[0])
    }catch(error){
      res.status(500).json(error)
    }
  });

  router.post("/", async (req, res) => {
    let {id, name, address, password, code} = req.body;
    try {
      const user = await client.query(
        `INSERT INTO users(id, name, address, username, password) VALUES ($1, $2, $3, $4, $5)`,
        [id, name, address, code, password]
      )
      const student = await client.query(
        `INSERT INTO students(code, id_user) VALUES ($1, $2)`,
        [code, id]
      )
      res.status(201).json({message: "Created Student"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error Creating Student"});
    }
  });

  router.delete("/:code", async (req, res) => {
    const { code } = req.params;
    try {
      const delStudent = await client.query("DELETE FROM students WHERE code=$1", [code]);
      const delUser = await client.query("DELETE FROM users WHERE username=$1", [code]);
      return res.status(200).json({ message: "Deleted Student" });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  router.put("/:user", async(req, res) => {
    const { user } = req.params;
    let { id, name, address, password, code, id_user} = req.body;
    console.log(user,id,name,code,address,password,id_user)

    try {
      const updateUser = await client.query(
          `
          UPDATE users
                    SET id = $1,
                    name = $2,
                    username = $3,
                    address = $4,
                    password= $5
                    WHERE id = $6
          `,
        [id, name, code, address,password, id_user]
      );
      const updateStudent = await client.query(
        `UPDATE students
        SET code = $1
        WHERE code = $2
        `,
      [code, user]
    );
      return res.status(200).json({message: "Student Updated"});
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  module.exports = router;
