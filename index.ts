import * as AWS from 'aws-sdk';
import {
  context,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Handler,
} from 'aws-lamda';
import * as Knex from 'Knex';
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

// create connection
const Knex = Knex({
  client: 'mysql',
  connection,
});
let count = 0;
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
    return response;
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({ failure: true, msg: error.stack });
    return response;
  }
}

// Lambda's entry-point with environment validation logic.
export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  const max = 10;
  const val = _.random(max);
  const response = {
    statusCode: 200,
    body: JSON.stringify(`The random value is ${val}`),
  };
  return response;
  // try {
  //   count++;
  //   const res = await Knex('vals').select();
  //   console.log('index.js ~ 51 res', res);
  // } catch (err) {}
  // return processRequest(events);
};

/*Test
(async () => {
  console.log(await processRequest({}));
  process.exit(0);
})();
// */
