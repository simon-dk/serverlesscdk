import { App, Stack, StackProps, Construct } from "../../";
import { Provider, Custom, HttpApi, CustomLambdaAuthorizer } from "../../";
import { aws_lambda as lambda } from "../../";

class RandomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new Provider(this, { logRetentionInDays: 14 }).addEnvironment("userName", "Simon");

    const authLambda = new lambda.Function(this, "auth", {
      entryfile: __dirname + "/lib/auth.ts",
      handler: "auth",
    });

    new HttpApi(this, { cors: false });
    new Custom(this, { key: { value: { nested: "val" } } });
    new CustomLambdaAuthorizer(this, "CustomAuthorizer", {
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
