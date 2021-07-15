import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";

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

  const winners = getRandomWinners(challenge);

  console.log(winners);

  return {
    statusCode: 200,
    body: JSON.stringify({ winners }),
  };
};
