const mysql = require("mysql2/promise");
const random_name = require('node-random-name');



const DB_HOST = 'db';
const DB_PORT = 3306;
const DB_USER = 'root';
const DB_PASSWORD = '102030';
const DB_NAME = 'my_database';

async function connect() {
  if (global.connection && global.connection.state !== 'disconnected') {
    return global.connection;
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  console.log("Connected to MySQL!");

  // Create table if it doesn't exist
  const createTableQuery = 'CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))';
  await connection.query(createTableQuery);
  console.log('Table created or already exists.');

  global.connection = connection;
  return connection;
}




async function selectNames(){
  const conn = await connect();
  const rows = await conn.query('SELECT * FROM people;');
  let dados = rows[0]
  return await dados;
}



module.exports = {connect,selectNames}