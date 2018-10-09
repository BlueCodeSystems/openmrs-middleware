import mysql from 'mysql2';

const pool = mysql.createPool({
  host:'34.240.241.171', 
  user: 'smartcerv', 
  password: 'smartcerv', 
  database: 'openmrs'});

export default pool;