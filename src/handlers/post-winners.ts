import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

import { RawChallenge, Challenge } from "../types";

const getChallenge = (event: APIGatewayProxyEvent): Challenge | null => {
  if (!event.body) {
    return null;
  }

  try {
    const rawChallenge: RawChallenge = JSON.parse(event.body);
    return {
      ...rawChallenge,
      students: rawChallenge.students.split(","),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRandomWinners = (challenge: Challenge) =>
  challenge.students
    .sort(() => 0.5 - Math.random())
    .slice(0, challenge.winners);

const saveWinners = async (challenge: Challenge) => {
  const db = new AWS.DynamoDB.DocumentClient();

  const TABLE_NAME = process.env.TABLE_NAME || "";

  const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`;
  const DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

  const params = {
    TableName: TABLE_NAME,
    Item: challenge,
  };

  try {
    await db.put(params).promise();
  } catch (dbError) {
    const errorResponse =
      dbError.code === "ValidationException" &&
      dbError.message.includes("reserved keyword")
        ? DYNAMODB_EXECUTION_ERROR
        : RESERVED_RESPONSE;

    throw new Error(errorResponse);
  }
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event);

  const challenge = getChallenge(event);

  if (!challenge) {
    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }

  if (challenge.students.length === 0) {
    return {
      statusCode: 400,
      body: "Invalid request: no students given",
    };
  }

  const winnersList = getRandomWinners(challenge);

  console.log(winnersList);

  try {
    await saveWinners({
      ...challenge,
      winnersList,
    });
  } catch (error) {
    return {
      statusCode: 400,
      body: error.message,
    };
  }

  console.log("saved to DB");

  return {
    statusCode: 201,
    body: JSON.stringify({ winners: winnersList }),
  };
};
