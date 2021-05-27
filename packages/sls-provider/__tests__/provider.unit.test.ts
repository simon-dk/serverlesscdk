import { CustomLambdaAuthorizer } from "..";
import { App, Stack } from "../..";
import { Function } from "../../aws-lambda";

describe("Custom Authorizer unit tests", () => {
  test("If authorizer arn is correct", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const customAuthorizer = new CustomLambdaAuthorizer(stack, "my-Authorizer");

    expect(customAuthorizer.arn).toEqual({
      "Fn::GetAtt": ["HttpApiAuthorizerMyDashAuthorizer", "Arn"],
    });
  });

  test("If lambda arn can be inserted correctly", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");

    const authFunc = new Function(stack, "my-Func", {
      handler: "my-handler",
    });

    const customAuthorizer = new CustomLambdaAuthorizer(stack, "myAuth", {
      functionArn: authFunc.arn,
    });

    expect(customAuthorizer.functionArn).toEqual({
      "Fn::GetAtt": ["MyDashFuncLambdaFunction", "Arn"],
    });
  });

  test("If public function for inserting lambda works", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");

    const authFunc = new Function(stack, "my_Func", {
      handler: "my-handler",
    });

    const customAuthorizer = new CustomLambdaAuthorizer(stack, "myAuth");
    customAuthorizer.addFunction(authFunc);

    expect(customAuthorizer.functionArn).toEqual({
      "Fn::GetAtt": ["MyUnderscoreFuncLambdaFunction", "Arn"],
    });
  });
});
