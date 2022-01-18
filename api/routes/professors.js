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
    let {code, id_staff} = req.body;
    try {
        await client.query(
          `INSERT INTO professors(code, id_staff)
          VALUES($1, $2)`,
          [code, id_staff]
      )
      res.status(201).json({message: "Created Professor"});
    } catch (error) {
        if(error.code === '23505'){
          return res.status(409).json({error: "Professor already exists"});
        }else{
          return res.status(500).json({error: "Error Creating Professor"});
        }
    }
  });


  router.delete("/:code", async (req, res) => {
    const { code } = req.params;
    try {
      await client.query("DELETE FROM professors WHERE code=$1", [code]);
      return res.status(200).json({ message: "Deleted Staff" });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

  router.put("/:professor", async(req, res) => {
    const {professor} = req.params;
    let {code, id_staff} = req.body;
    try {
      await client.query(
        `UPDATE professors
        SET code = $1,
        id_staff = $2
        WHERE code = $3
        `,
      [code, id_staff, professor]

    )
      return res.status(200).json({message: "Professor Updated"});
    } catch (error) {
      return res.status(500).send(error);
    }
  });


  module.exports = router;