var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
    try {
      const response = await client.query(`
      SELECT
        a.id AS id_admin,
        u.id,
        u.name,
        u.address,
        u.username,
        u.password,
        FROM administrators a
      INNER JOIN users u
      ON a.id_user = u.id`);
      return res.status(200).json(response.rows);
    } catch (error) {
      res.status(500).json(error);
    }
});

router.get('/:id', async function(req,res){
    const {id} = req.params
    try{
      const response = await client.query(`SELECT * FROM administrators id_user = $1 or id = $1`, [id])
      if(response.rowCount == 0) res.status(404).send('No existe')
      else res.status(200).json(response)
    }catch(error){
      res.status(500).json(error)
    }
});

router.post("/", async (req, res) => {
    let {id, name, address, password, id_admin} = req.body;
    try {
      await client.query(
        `INSERT INTO users(id, name, address, username, password) VALUES ($1, $2, $3, $4, $5)`,
        [id, name, address, id, password]
      )
      await client.query(
        `INSERT INTO administrators(id, id_user) VALUES ($1, $2)`,
        [id_admin, id]
      )
      res.status(201).json({message: "Created Admin"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error Creating Admin"});
    }
  });

  router.delete("/:admin", async (req, res) => {
    const { admin } = req.params;
    try {
        const userID = await client.query("SELECT id_user FROM administrators WHERE id=$1", [admin]);
        await client.query("DELETE FROM users WHERE id=$1", [userID]);
      return res.status(200).json({ message: "Deleted Admin" });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  router.put("/:admin&:user", async(req, res) => {
    const { admin,user} = req.params;
    let { id, name, address, password, id_admin} = req.body;
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
        `UPDATE administrators
        SET id = $1
        WHERE code = $2
        `,
      [id_admin, admin]
    );
      return res.status(200).json({message: "Admin Updated"});
    } catch (error) {
      return res.status(500).send(error);
    }
  });


module.exports = router;