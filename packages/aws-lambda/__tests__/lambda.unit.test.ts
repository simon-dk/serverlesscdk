import { App, Stack } from "../../";
import { LambdaFunction } from "../";

describe("Lambda Unit Tests", () => {
  test("When runtime is nodejs and there is no env added", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const lambda = new LambdaFunction(stack, "mylambda", {
      runtime: "nodejs14.x",
      handler: "custom/handler",
    });

    expect(lambda.environment.AWS_NODEJS_CONNECTION_REUSE_ENABLED).toBe("1");
  });
});
