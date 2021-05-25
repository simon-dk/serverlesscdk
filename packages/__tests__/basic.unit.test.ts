import { App, Stack, Construct, Custom, Plugins } from "../core";
// import { LambdaFunction } from "@serverlesscdk/aws-lambda";
// import { Provider } from "@serverlesscdk/sls-provider";
// import { PolicyStatement } from "@serverlesscdk/aws-iam";

// import { App, Stack } from "../";

// const app = new App();

// class CustomStack extends Stack {
//   constructor(scope: Construct, id: string, props: any = {}) {
//     super(scope, id);

//     new Provider(this, { logRetentionInDays: 14 })
//       .addDeploymentBucket({ name: "myBucket" })
//       .addIamStatement(new PolicyStatement({ actions: ["DoSomething"], resources: ["*"] }))
//       .addIamStatement(new PolicyStatement({ actions: ["s3:Download"], resources: ["*"] }))
//       .addHttpApi({ cors: true, payload: "2.0" })
//       .addCustomAuthorizer("MyAuthorizer", { enableSimpleResponses: true });

//     new Plugins(this, { plugins: ["myPlugin"] });

//     new LambdaFunction(this, "myLambda", {
//       name: "myLambda",
//       handler: "myhandler",
//       entryfile: __dirname + "/_testlambda.ts",
//       description: "This is a description",
//     });
//   }
// }

// new CustomStack(app, "myService");
// console.log(app.synth());

describe("basic app", () => {
  test("If app is a parent", () => {
    const app = new App();
    expect(app.node.id).toBe("");
    expect(app.node.findAll().length).toBe(1);
  });
});

test("Creating an app and a stack", () => {
  const app = new App();
  const stack = new Stack(app, "myStack");

  expect(stack.node.id).toBe("myStack");
  expect(app.node.findAll().length).toBe(2);
});
