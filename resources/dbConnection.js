import mysql from 'mysql2';
import moment from 'moment-timezone'

const pool = mysql.createPool({

  host: process.env.MYSQL_HOST || "localhost", 
  user: process.env.MYSQL_USERNAME || "openmrs", 
  password: process.env.MYSQL_USER_PASSWORD || "openmrs", 
  database: process.env.OPENMRS_MYSQL_DATABASE || "openmrs",
  typeCast
});


function typeCast(field, next){

  if (field.type == 'DATETIME') {

    let dateString = field.string()
      return (dateString == null)? null: moment.tz(dateString,process.env.TZ).format('YYYY-MM-DDTHH:mm:ss')
  }
  return next();
}

export default pool;