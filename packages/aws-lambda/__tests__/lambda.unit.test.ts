import { App, Stack } from "../../";
import { Function } from "../";

describe("Lambda Unit Tests", () => {
  test("When runtime is nodejs and there is no env added", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const lambda = new Function(stack, "mylambda", {
      runtime: "nodejs14.x",
      handler: "custom/handler",
    });

    expect(lambda.environment.AWS_NODEJS_CONNECTION_REUSE_ENABLED).toBe("1");
  });
});
