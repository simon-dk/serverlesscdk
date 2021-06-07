import { CustomLambdaAuthorizer, JwtAuthorizer } from "..";
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

describe("Jwt auth unit-test", () => {
  let app: any;
  let stack: any;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "my-stack");
  });

  test("if default jwt is created", () => {
    const auth = new JwtAuthorizer(stack, "myAuth", {
      audience: ["admin"],
      issuerUrl: "https://google.com",
    }).synth();

    expect(auth.provider.httpApi.authorizers.myAuth.identitySource).toBe(
      "$request.header.Authorization"
    );
    expect(auth.provider.httpApi.authorizers.myAuth.audience.length).toBe(1);
    expect(auth.provider.httpApi.authorizers.myAuth.issuerUrl).toBe("https://google.com");
  });

  test("if identity source is created", () => {
    const auth = new JwtAuthorizer(stack, "myAuth", {
      audience: ["admin", "users"],
      issuerUrl: "https://google.com",
      identitySource: "$request.header.Token",
    }).synth();

    expect(auth.provider.httpApi.authorizers.myAuth.identitySource).toBe("$request.header.Token");
    expect(auth.provider.httpApi.authorizers.myAuth.audience.length).toBe(2);
    expect(auth.provider.httpApi.authorizers.myAuth.issuerUrl).toBe("https://google.com");
  });
});
