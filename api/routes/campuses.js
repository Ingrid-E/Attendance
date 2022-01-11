var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
    try {
      const response = await client.query(`
        SELECT
        c.id, c.name, c.location, c.id_administrator,
        u.name, u.id AS id_admin
        FROM campus c
        INNER JOIN administrators a
            ON c.id_administrator = a.id
        INNER JOIN users u
            ON a.id_user = u.id
        `);
      return res.status(200).json(response.rows);
    } catch (error) {
      res.status(500).json({error:error});
    }
  });

  router.get('/:id', async function(req,res){
    const {id} = req.params
    try{
      const response = await client.query(`
        SELECT
        c.id, c.name, c.location, c.id_administrator,
        u.name, u.id AS id_admin
        FROM campus c
        INNER JOIN administrators a
            ON c.id_administrator = a.id
        INNER JOIN users u
            ON a.id_user = u.id
        WHERE c.id = $1 or c.id_admin = $1
        `, [id])
      if(response.rowCount == 0) return res.status(404).json({error: 'No existe'})
      else res.status(200).json(response)
    }catch(error){
      res.status(500).json({error: error})
    }
  });

  router.post("/", async (req, res) => {
    let {id, id_administrator, name, location,} = req.body;
    try {
      await client.query(
        `INSERT INTO campus(id, name, location, id_administrator)
        VALUES ($1, $2, $3, $4)`,
        [id, name, location, id_administrator]
      )
      res.status(201).json({message: "Created"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error"});
    }
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await client.query("DELETE FROM campus WHERE id=$1", [id]);
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
      return res.status(500).json({error: error});
    }
  });

  router.put("/:campus", async(req, res) => {
    const {campus} = req.params;
    let {id, name, location, id_administrator} = req.body;
    try {
      await client.query(
          `
          UPDATE campus
                    SET id = $1,
                    name = $2,
                    location = $3,
                    id_administrator = $4,
                    WHERE id = $6
          `,
        [id, name, location, id_administrator,campus]
      );
      return res.status(200).json({message: "Updated"});
    } catch (error) {
      return res.status(500).json({error:error});
    }
  });


module.exports = router;