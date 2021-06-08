import { App, Stack, StackProps, Construct, Custom, Provider } from "../../";
import { aws_lambda as lambda, aws_apigatewayv2 as apigw } from "../../";

class RandomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new Provider(this, { logRetentionInDays: 14 }).addEnvironment("userName", "Simon");

    const authLambda = new lambda.Function(this, "auth", {
      entryfile: __dirname + "/lib/auth.ts",
      handler: "auth",
    });

    new apigw.HttpApi(this, { cors: false });
    new Custom(this, { key: { value: { nested: "val" } } });

    new apigw.HttpJwtAuthorizer(this, "JwtAuth", {
      audience: [""],
      issuerUrl: "",
    });

    new apigw.HttpLambdaAuthorizer(this, "CustomAuthorizer", {
      functionArn: authLambda.arn,
      enableSimpleResponses: true,
    });

    new lambda.Function(this, "getUser", {
      entryfile: __dirname + "/lib/getUser.ts",
      handler: "get",
      events: [
        {
          httpApi: { method: "GET", path: "/user/{id}", authorizer: { name: "CustomAuthorizer" } },
        },
      ],
    });
  }
}

const app = new App();
new RandomStack(app, "My-service", { env: { region: "eu-central-1" } });

console.log(app.synth());
export = app.synth();
