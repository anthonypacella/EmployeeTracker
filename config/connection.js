const mysql = require('mysql2');

// Set connection to the database
const connection = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'employee_db'
    },
    console.log('Connected to employee database')
  );

  const connectionPromise = connection.promise();
  module.exports = connectionPromise;