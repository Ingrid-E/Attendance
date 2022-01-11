var express = require("express");
var router = express.Router();
var client = require("../bd");

router.get("/", async (req, res) => {
    try{
        const response = await client.query(`
        SELECT
        a.id,
        a.code_course, c.name AS course,
        a.id_staff, a.code_student,
        u.name,
        a.time

        FROM assistance a
        INNER JOIN staff s
            ON a.id_staff = s.id
        INNER JOIN courses c
            ON a.code_course = c.code
        INNER JOIN students st
            ON a.code_student = st.code
        INNER JOIN users u
            ON s.id_user = u.id or
            st.id_user = u.id`)

        return res.status(200).json(response.rows);
    }catch(error){
        res.status(500).json(error);
    }
})

router.get('/:id', async function(req,res){
    const {id} = req.params
    try{
      const response = await client.query(`
      SELECT
        a.id,
        a.code_course, c.name AS course,
        a.id_staff, a.code_student,
        u.name,
        a.time
        FROM assistance a
        INNER JOIN staff s
            ON a.id_staff = s.id
        INNER JOIN courses c
            ON a.code_course = c.code
        INNER JOIN students st
            ON a.code_student = st.code
        INNER JOIN users u
            ON s.id_user = u.id or
            st.id_user = u.id
        WHERE s.id = $1 or  s.code_course= $1 or s.code_student = $1 or s.id_staff = $1
        `, [id])
      if(response.rowCount == 0) res.status(404).send('No existe')
      else return res.status(200).json(response.rows)
    }catch(error){
      res.status(500).json(error)
    }
  });

router.post('/', async(req,res)=>{
    const {time, code_course, code_student, id_staff} = req.body
    try{
        await client.query(`
        INSERT INTO assistance(time, code_course, code_student, id_staff)
        VALUES ($1, $2, $3, $4)
        `, [time, code_course, code_student, id_staff])
        return res.status(200).json({message:"CREATED"})
    }catch(error){
        return res.status(500).json({error: error});
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await client.query("DELETE FROM assistance WHERE id=$1", [userID]);
      return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        return res.status(200).json({ error: error });
    }
  });

  router.put("/:assistance", async(req, res) => {
    const { assistance} = req.params;
    let {id, id_staff, code_course, code_student, time} = req.body;
    try {
      await client.query(
          `
          UPDATE assistance
                    SET id = $1,
                    time = $2,
                    id_staff = $3,
                    code_course = $4,
                    code_student= $5
                    WHERE id = $6
          `,
        [id, time, id_staff, code_course,code_student, assistance]
      );
      return res.status(200).json({message: "Updated"});
    } catch (error) {
      return res.status(500).send({error: error});
    }
  });

module.exports = router;