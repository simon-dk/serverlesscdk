import { CustomLambdaAuthorizer } from "..";
import { App, Stack } from "../..";
import { Function } from "../../aws-lambda";

describe("Custom Authorizer unit tests", () => {
  test("", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");

    const authFunc = new Function(stack, "my-Func", {
      handler: "my-handler",
    });

    const customAuthorizer = new CustomLambdaAuthorizer(stack, "myAuth", {
      functionArn: authFunc.arn,
    });

    expect(customAuthorizer.functionArn).toEqual({ "Fn::GetAtt": ["MyDashFuncLambdaFunction", "Arn"] });
  });
});
