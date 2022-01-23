'use strict';
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'xenum.cdhd2xlqunl4.ca-central-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Holiday-21',
  port: 3306,
  database: 'xenum',
  debug: false,
});

module.exports.handler = (event, context, callback) => {
  // **Connection to database**
  connection.connect(function (err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      context.fail();
      return;
    } else {
      console.log('Connected to database.');
    }
  });

  connection.query('show tables from xenum', function (error, results, fields) {
    if (error) {
      console.log('error: connection failed with db!');
      connection.destroy();
      throw error;
    } else {
      // connected!
      console.log('info: connection ok with db!');
      console.log(results);
      context.succeed('done');
      callback(error, results);
    }
  });

  //Send API Response
  callback(null, {
    statusCode: '200',
    body: 'succeed',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  //Close Connection
  connection.end(); // Missing this section will result in timeout***
};
