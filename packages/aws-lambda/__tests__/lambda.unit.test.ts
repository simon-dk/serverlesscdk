import { App, Stack, Provider } from "../..";
import { Function } from "..";

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

  test("Function name should not contain LambdaFunction", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const lambda = new Function(stack, "mylambda", {
      runtime: "nodejs14.x",
      handler: "custom/handler",
    });

    expect("mylambda" in lambda.synth().functions).toBe(true);
    expect("mylambdaLambdaFunction" in lambda.synth().functions).toBe(false);
    expect(lambda.logicalId).toBe("MylambdaLambdaFunction");
  });

  test("LogicalId should be formatted correctly", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const lambda = new Function(stack, "my-get_User", {
      runtime: "nodejs14.x",
      handler: "custom/handler",
    });

    expect(lambda.logicalId).toBe("MyDashgetUnderscoreUserLambdaFunction");
  });
});

describe("Lambda Bundling unit tests", () => {
  test("Bundling with runtime should succeed", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const lambda = new Function(stack, "mylambda", {
      runtime: "nodejs14.x",
      handler: "handler",
      entryfile: __dirname + "/testlambda.ts",
      package: { patterns: ["node_modules"] },
    });

    expect(lambda.handler.includes("mylambda/index.handler")).toBe(true);
  });

  test("Bundling should return a package with pattern ", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    const lambda = new Function(stack, "mylambda", {
      runtime: "nodejs14.x",
      handler: "handler",
      entryfile: __dirname + "/testlambda.ts",
      package: { patterns: ["node_modules"] },
    });

    const patterns = lambda?.package?.patterns as any;

    expect(patterns[0]).toBe("node_modules");
    expect(patterns[1]).toBe("build/mylambda/index.js");
  });

  test("Bundling with provider should succeed", () => {
    const app = new App();
    const stack = new Stack(app, "mystack");
    new Provider(stack, { runtime: "nodejs12.x" });
    const lambda = new Function(stack, "mylambda", {
      handler: "handler",
      entryfile: __dirname + "/testlambda.ts",
    });

    expect(lambda.handler.includes("mylambda/index.handler")).toBe(true);
  });

  test("Bundling with provider with wrong runtime should fail", () => {
    expect(() => {
      const app = new App();
      const stack = new Stack(app, "mystack");
      new Provider(stack, { runtime: "golang" });
      new Function(stack, "mylambda", {
        handler: "handler",
        entryfile: __dirname + "/testlambda.ts",
      });
    }).toThrowError("Cannot extract node-version from runtime.");
  });

  test("Bundling without provider and runtime should fail", () => {
    expect(() => {
      const app = new App();
      const stack = new Stack(app, "mystack");
      new Function(stack, "mylambda", {
        handler: "handler",
        entryfile: __dirname + "/testlambda.ts",
      });
    }).toThrowError();
  });
});
