import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

const getWinners = async () => {
  const db = new AWS.DynamoDB.DocumentClient();

  const TABLE_NAME = process.env.TABLE_NAME || "";

  const params = {
    TableName: TABLE_NAME,
  };

  return await db.scan(params).promise();
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log(event);

  try {
    const challenges = await getWinners();

    console.log(challenges);

    return {
      statusCode: 200,
      body: JSON.stringify(challenges),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
