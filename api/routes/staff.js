var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
    try {
      const response = await client.query(`
        SELECT
            staff.id AS id_staff,
            users.id,
            users.name,
            users.address,
            users.username,
            users.password,
            staff.salary,
            staff.eps,
            staff.arl,
            staff.id_campus
        FROM   staff
        INNER JOIN users
            ON staff.id_user = users.id
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
            staff.id AS id_staff,
            users.id,
            users.name,
            users.address,
            users.username,
            users.password,
            staff.salary,
            staff.eps,
            staff.arl,
            staff.id_campus
        FROM   staff
        INNER JOIN users
            ON staff.id_user = users.id
        WHERE staff.id_user = $1 or staff.id = $1
        `, [id])
      if(response.rowCount == 0) res.status(404).send('No existe')
      else res.status(200).json(response)
    }catch(error){
      res.status(500).json(error)
    }
  });

  router.post("/", async (req, res) => {
    let {id, name, address, password,
        salary, eps, arl, id_campus} = req.body;
    try {
      await client.query(
        `INSERT INTO users(id, name, address, username, password)
        VALUES ($1, $2, $3, $4, $5)`,
        [id, name, address, id, password]
      )
      await client.query(
        `INSERT INTO staff(salary, eps, arl, id_campus, id_user)
        VALUES ($1, $2, $3, $4, $5)`,
        [salary, eps, arl, id_campus, id]
      )
      res.status(201).json({message: "Created Staff"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error Creating Staff"});
    }
  });

  router.delete("/:id_staff", async (req, res) => {
    const { id_staff } = req.params;
    try {
      const userID = await client.query("SELECT id_user FROM staff WHERE id=$1", [id_staff]);
      await client.query("DELETE FROM users WHERE id=$1", [userID]);
      return res.status(200).json({ message: "Deleted Staff" });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  router.put("/:staff&:user", async(req, res) => {
    const { staff, user} = req.params;
    console.log(staff, user)
    console.log(req.body)
    let {id, name, address, password,
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
        [id, name, id, address,password, user]
      );
      await client.query(
        `UPDATE staff
        SET id = $1,
        salary = $2,
        eps = $3,
        arl = $4,
        id_campus = $5
        WHERE id = $6
        `,
      [id_staff,salary, eps, arl, id_campus, staff]
    );
      return res.status(200).json({message: "Staff Updated"});
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  });

module.exports = router;
