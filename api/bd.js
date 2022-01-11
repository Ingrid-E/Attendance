const {Pool} = require('pg')
const client = new Pool({
  host: "0.0.0.0",
  user: "postgres",
  port: "5432",
  password: "root",
  database: "attendance"
})

client.connect();

module.exports = client;
