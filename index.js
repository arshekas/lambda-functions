import * as AWS from 'aws-sdk';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
  Context,
} from 'aws-lambda';

import * as _ from 'lodash';

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
    const { rank } = events.body;
    const { limit } = events.params;
    const response = await knex('users')
      .select('*')
      .orderBy(rank, 'desc')
      .limit(limit);
    return response;
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
