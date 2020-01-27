import mysql from 'mysql2';

const pool = mysql.createPool({

  host: process.env.MYSQL_HOST || "localhost", 
  user: process.env.MYSQL_USERNAME || "openmrs", 
  password: process.env.MYSQL_USER_PASSWORD || "openmrs", 
  database: process.env.OPENMRS_MYSQL_DATABASE || "openmrs",
  typeCast(field, next) {
    if(field.type == 'DATETIME') {
        return new Date(field.string() + 'Z');
    }
    return next();
  }
});

export default pool;