import mysql2 from 'mysql2/promise';

const connection = await mysql2.createConnection({
  host: 'localhost',     
  user: 'root',          
  password: '',          
  database: 'foodsreviews',

});

export default connection;

  