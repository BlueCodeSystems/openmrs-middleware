import mysql from 'mysql2';

const pool = mysql.createPool({
  host:'0.0.0.0', 
  user: 'XXXXXXX', 
  password: 'XXXXXX', 
  database: 'XXXXXX'});

export default pool;