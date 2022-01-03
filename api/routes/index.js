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
    const response = await client.query(`SELECT * FROM usuarios WHERE nombre_usuario = $1`, [username])
    if(response.rowCount == 0) res.status(404).send('No existe')
    else res.status(200).json(response.rows[0])
    console.log("Resultado \n", response)
  }catch(error){
    console.error(error)
    res.status(500).json(error)
  }
});

router.post('/login', async(req,res)=>{
  console.log(req.body)
  let nombre_usuario = req.body.username;
  let contrasenia = req.body.password;
  if(!nombre_usuario || !contrasenia){
    res.status(400).send("INVALID REQUEST DATA")
    return
  }
  try{
    const response = await client.query(`SELECT * FROM usuarios WHERE nombre_usuario = $1 and contrasenia =$2`, [nombre_usuario, contrasenia])
    if(response.rowCount == 0) res.status(404).send('No existe')
    else res.status(200).json(response.rows[0].tipo)
    console.log("Resultado \n", response)
  }catch(error){
    console.error(error)
    res.status(500).json(error)
  }

})





/* GET home page. */
router.get('/users', async function(req, res, next) {
  const response = await client.query('SELECT * FROM usuarios')
  res.status(200).json(response.rows);
});


router.post('/personas', async function(req, res){
  const {identificacion, nombre, apellido, direccion} = req.body
  const response  = await client.query('INSERT INTO personas (identificacion, nombre, apellido, direccion) VALUES ($1, $2, $3, $4)',
               [identificacion, nombre, apellido, direccion])
  console.log(response)
  res.send('user creado')
});

module.exports = router;
