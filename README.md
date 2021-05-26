# serverlesscdk

Create Serverless resources with a CDK-like framework

## A word of warning

This framework as a work in progress and should not be used in production, yet. It uses a CDK-like structure but uses Serverless (Framework) as its underlying framework.

## Why is this neccesary

AWS CDK is an amazing software suite. But it is also very complex, and althoug it is extremely usefull for settin up general infrastricture like VPC, databases etc., creating and deploying Serverless infrastructure is often slow and cumbersome.
Serverless Framework on the other hand has ALMOST perfected the way we create Serverless systems. With quick deployments and sane defaults to many services. But Serverless Framework is limited. Writing stacks in yml is dreadfull for many,
and although serverless can handle .js and .ts files, you dont get much help or typesafety out of the box. ServerlessCDK is a way for developers to create Stacks using Serverless Framework, but written with reusable constructs, just like CDK.

For lambda function we use esbundle for an easy build/deploy workflow.

## Get started with ServerlessCDK

```console
$ mkdir my-service
Create folder
$ cd my-service
Cd into folder
$ touch serverless.ts
Create entryfile. Should always be serverless.ts
```

In your serverless.ts file you can create a new stack like this:

```ts
import { App, Stack, Construct, Provider, Region } from "serverlesscdk";
import { aws_lambda as lambda } from "serverlesscdk";

export class MyService extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Provider(this, { region: Region.EU_CENTRAL_1 });
    new lambda.Function(this, "myLambda", {
      runtime: "nodejs14.x",
      entryfile: __dirname + "/handler.ts",
      handler: "handler",
      package: { individually: true, patterns: ["build/my-lambdaLambdaFunction/*"] },
    });
  }
}

const app = new App();
new MyService(app, "MyStack");

export = app.synth();
```

With the structure above you can now run:

```console
$ serverless deploy
Deploys service with serverless
```

app.synth() will synthesize a json template that Serverless then deploys. You can use all regular serverless commands.

## Wanna help out?

We are very much open to help, PR's etc.
