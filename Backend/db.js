// backend/db.js 
const { Pool } = require('pg'); 
const dotenv = require('dotenv'); 

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
});

pool.connect()
  .then(() => console.log('DB conectada'))
  .catch(err => console.error('Error al conectar DB:', err));


module.exports = pool; 