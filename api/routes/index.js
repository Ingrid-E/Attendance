var express = require('express')
var router = express.Router()

const {Pool} = require('pg')
const client = new Pool({
  host: "0.0.0.0",
  user: "postgres",
  port: "5432",
  password: "root",
  database: "attendance"
})

client.connect();

router.get('/users/:username', async function(req,res){
  const {username} = req.params
  try{
    const response = await client.query(`SELECT * FROM users WHERE username = $1`, [username])
    if(response.rowCount == 0) res.status(404).send('No existe')
    else res.status(200).json(response.rows[0])
    console.log("Resultado \n", response)
  }catch(error){
    console.error(error)
    res.status(500).json(error)
  }
});

router.get('/campuses', async (req,res)=>{
  try{
    const response = await client.query(`SELECT * FROM campus`)
    return res.status(200).json(response.rows)
  }catch(error){
    res.status(500).json(error)
  }

})

router.get('/courses', async (req,res)=>{
  try{
    const response = await client.query(`SELECT * FROM courses`)
    return res.status(200).json(response.rows)
  }catch(error){
    res.status(500).json(error)
  }

})


router.get('/professors', async (req,res)=>{
  try{
    const response = await client.query(`SELECT name,code
    FROM professors p
    INNER JOIN staff s
    ON p.id_staff=s.id
    INNER JOIN users u
    ON s.id_user=u.id;`)
    return res.status(200).json(response.rows)
  }catch(error){
    res.status(500).json(error)
  }
})

router.post('/course', async(req,res)=>{
  let {code, name, credits,id_campus,code_professor} = req.body
  console.log("Data: ", code,name,credits,id_campus, code_professor)
  try {
    const create = await client.query(`INSERT INTO courses(code, name, credits, code_professor, id_campus) VALUES ($1, $2, $3, $4, $5)`,
      [code,name,credits,code_professor,id_campus])
      res.status(201).json(create)
  }catch(error){
    if(error.code === '23505'){
      return res.status(409).json("Already exists")
    }else{
      return res.status(500).json(error)
    }

  }
})

router.delete('/courses/:code',(req,res)=>{
  const{code} = req.params;
  try{
    const deleted = client.query('DELETE FROM courses WHERE code=$1', [code])
    return res.status(200).json({message: "Deleted"})
  }catch(error){
    return res.status(500).send(error)
  }

})

router.post('/login', async(req,res)=>{
  console.log(req.body)
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    res.status(400).send("INVALID REQUEST DATA")
    return
  }
  try{
    const userType = {type: ''}
    const response = await client.query(`SELECT * FROM users WHERE username = $1 and password =$2`, [username, password])
    if(response.rowCount == 0) return res.status(404).send('No existe')
    else {
      const userID = (await client.query(`SELECT id FROM users WHERE username = $1`, [username])).rows[0].id
      const administrator = (await client.query(`SELECT 1 FROM administrators WHERE id_user=$1`, [userID])).rowCount
      const student = (await client.query(`SELECT 1 FROM students WHERE id_user=$1`, [userID])).rowCount
      const staff = (await client.query(`SELECT 1 FROM staff WHERE id_user=$1`, [userID])).rowCount
      console.log(administrator, staff, student)
      if(administrator > 0) userType.type = 'admin'
      else if(student > 0) userType.type = 'student'
      else if(staff > 0) userType.type = 'staff'
      else{ return res.status(404).send('Not Found')}
      return res.status(200).json(userType.type)
    }
  }catch(error){
    console.error(error)
    res.status(500).json(error)
  }

})





/* GET home page. */
router.get('/users', async function(req, res, next) {
  const response = await client.query('SELECT * FROM users')
  res.status(200).json(response.rows);
});

module.exports = router;
