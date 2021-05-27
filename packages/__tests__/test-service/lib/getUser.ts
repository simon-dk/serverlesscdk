export const get = async (event: any, context: any) => {
  console.log(event);
  console.log(context);

  const { id } = event.pathParameters;
  const user = event.requestContext.authorizer.lambda;
  const userObject = {
    id,
    ...user,
  };

  return { statusCode: 200, body: JSON.stringify(userObject) };
};
