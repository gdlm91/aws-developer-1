export const handler = async (event: any, context: any) => {
  console.log(event);

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({ result: "heeeey" }),
  };
};
