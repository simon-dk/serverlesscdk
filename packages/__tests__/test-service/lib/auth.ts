export const auth = async (event: any, context: any) => {
  console.log(event);
  console.log(context);

  return {
    isAuthorized: true,
    context: {
      name: "Simon",
      age: 36,
      address: "Long Street 123",
      city: "Gotham City",
      zip: "55505",
    },
  };
};
