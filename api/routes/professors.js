var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
  try {
    const response = await client.query(`
    SELECT
        u.id, u.name, u.address, u.username, u.password,
        s.salary, s.eps, s.arl, s.id_campus,
        p.code, p.id_staff
    FROM professors p
    INNER JOIN staff s
        on p.id_staff = s.id
    INNER JOIN users u
        on s.id_user = u.id
`);
    return res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async function(req,res){
    const {id} = req.params
    try{
      const response = await client.query(`
      SELECT
          u.id, u.name, u.address, u.username, u.password,
          s.salary, s.eps, s.arl, s.id_campus,
          p.code, p.id_staff
      FROM professors p
      INNER JOIN staff s
          on p.id_staff = s.id
      INNER JOIN users u
          on s.id_user = u.id
      WHERE p.id_staff = $1 or p.code = $1 or s.id_user = $1
    `, [id]);
      if(response.rowCount == 0) res.status(404).send('No existe')
      else res.status(200).json(response)
    }catch(error){
      res.status(500).json(error)
    }
  });

  router.post("/", async (req, res) => {
    let {id, name, address, password, code,
    salary, eps, arl, id_campus,
    } = req.body;
    try {
       await client.query(
        `INSERT INTO users(id, name, address, username, password) VALUES ($1, $2, $3, $4, $5)`,
        [id, name, address, code, password]
      )
      await client.query(
        `INSERT INTO staff(salary, eps, arl, id_campus, id_user)
        VALUES ($1, $2, $3, $4, $5)`,
        [salary, eps, arl, id_campus, id]
      )
      const staffID = await client.query(`SELECT id FROM staff WHERE id_user = ${id}`)
      await client.query(
          `INSERT INTO professors(code, id_staff)
          VALUES($1, $2)`,
          [code, staffID]
      )
      res.status(201).json({message: "Created Professor"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error Creating Professor"});
    }
  });


  router.delete("/:code", async (req, res) => {
    const { code } = req.params;
    try {
      const staffID = await client.query("SELECT id_staff FROM professors WHERE code=$1", [code]);
      const userID = await client.query("SELECT id_user FROM staff WHERE id=$1", [staffID]);
      await client.query("DELETE FROM users WHERE id=$1", [userID]);
      return res.status(200).json({ message: "Deleted Staff" });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  router.put("/:professor&:staff&:user", async(req, res) => {
    const { professor, staff, user} = req.params;
    let {id, name, code, address, password,
        id_staff, salary, eps, arl, id_campus} = req.body;
    try {
      await client.query(
          `
          UPDATE users
                    SET id = $1,
                    name = $2,
                    username = $3,
                    address = $4,
                    password= $5
                    WHERE id = $6
          `,
        [id, name, code, address,password, user]
      );
      await client.query(
        `UPDATE staff
        SET id = $1,
        salary = $2,
        eps = $3,
        arl = $4,
        id_campus = $5
        WHERE id = $7
        `,
      [id_staff,salary, eps, arl, id_campus, staff])

      await client.query(
        `UPDATE professors
        SET code = $1,
        WHERE code = $7
        `,
      [code, professor]

    )
      return res.status(200).json({message: "Professor Updated"});
    } catch (error) {
      return res.status(500).send(error);
    }
  });


  module.exports = router;