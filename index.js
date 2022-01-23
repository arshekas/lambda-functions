import * as AWS from 'aws-sdk';

// Imports below for typescript version of this file
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
  Context,
} from 'aws-lambda';

AWS.config.update({ region: 'ca-central-1' });

const host = 'xenum.cdhd2xlqunl4.ca-central-1.rds.amazonaws.com';
const user = 'admin';
const password = 'Holiday-21';
const database = 'xenum';

const connection = {
  ssl: { rejectUnauthorized: false },
  host,
  user,
  password,
  database,
};

// SQL query builder for MariaDB, MySql
const knex = require('knex')({
  client: 'mysql',
  connection,
});

// Format of the response from this API call.
const response = {
  isBase64Encoded: false,
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  body: '',
};

async function processRequest(events) {
  try {
    // **Connection to database**
    connection.connect(function (err) {
      if (err) {
        console.error('Database connection failed: ' + err.stack);
        context.fail();
        return;
      } else {
        console.log('Connected to database.');
        // getting the rank and limit from body
        const { rank } = events.body;
        const { limit } = events.params;

        // return users according to the rank and limit
        const response = await knex('users')
          .select('*')
          .orderBy(rank, 'desc')
          .limit(limit);
        return response;
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
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({ failure: true, msg: error.stack });
    return response;
  }
}

// Lambda's entry-point with environment validation logic.
export const handler = async (event) => {
  return processRequest(event);
};

/*Test
(async () => {
  console.log(await processRequest({}));
  process.exit(0);
})();
// */
