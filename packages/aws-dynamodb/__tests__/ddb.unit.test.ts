import { aws_dynamodb as dynamo, App, Stack } from "../../";

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, "TestStack");
});

describe("DynamoDb Unit test", () => {
  test("When a basic table is created", () => {
    const table = new dynamo.Table(stack, "MyTable");
    const output = table.synth();
    const { MyTable } = output.resources.Resources;

    expect(MyTable.Type).toBe("AWS::DynamoDB::Table");
    expect(MyTable.Properties.TableName).toBe("MyTable");
    expect(MyTable.Properties.AttributeDefinitions.length).toBe(1);
    expect(MyTable.Properties.AttributeDefinitions[0].AttributeName).toBe("PK");
    expect(MyTable.Properties.AttributeDefinitions[0].AttributeType).toBe("S");

    expect(MyTable.Properties.KeySchema.length).toBe(1);
    expect(MyTable.Properties.KeySchema[0].AttributeName).toBe("PK");
    expect(MyTable.Properties.KeySchema[0].KeyType).toBe("HASH");

    expect(MyTable.Properties.BillingMode).toBe("PAY_PER_REQUEST");
    expect(MyTable.Properties.ProvisionedThroughput).toBe(undefined);
    expect(MyTable.DeletionPolicy).toBe(undefined);
  });

  test("When a primary/secondary keys are inserted", () => {
    const table = new dynamo.Table(stack, "MyTable", {
      partitionKey: { name: "ID", type: "S" },
      sortKey: { name: "DATE", type: "S" },
    });
    const output = table.synth();
    const { MyTable } = output.resources.Resources;

    expect(MyTable.Properties.AttributeDefinitions.length).toBe(2);
    expect(MyTable.Properties.AttributeDefinitions[0].AttributeName).toBe("ID");
    expect(MyTable.Properties.AttributeDefinitions[1].AttributeName).toBe("DATE");

    expect(MyTable.Properties.KeySchema.length).toBe(2);
    expect(MyTable.Properties.KeySchema[0].KeyType).toBe("HASH");
    expect(MyTable.Properties.KeySchema[1].KeyType).toBe("RANGE");
  });

  test("When billingmode is provisioned", () => {
    const table = new dynamo.Table(stack, "MyTable", { billingMode: "PROVISIONED" });
    const output = table.synth();
    const { MyTable } = output.resources.Resources;

    expect(MyTable.Properties.BillingMode).toBe("PROVISIONED");
    expect(MyTable.Properties.ProvisionedThroughput.ReadCapacityUnits).toBe(5);
    expect(MyTable.Properties.ProvisionedThroughput.WriteCapacityUnits).toBe(5);
  });

  test("When billingmode is provisioned and with custom rcu/wcu", () => {
    const table = new dynamo.Table(stack, "MyTable", {
      billingMode: "PROVISIONED",
      readCapacity: 50,
      writeCapacity: 25,
    });
    const output = table.synth();
    const { MyTable } = output.resources.Resources;

    expect(MyTable.Properties.BillingMode).toBe("PROVISIONED");
    expect(MyTable.Properties.ProvisionedThroughput.ReadCapacityUnits).toBe(50);
    expect(MyTable.Properties.ProvisionedThroughput.WriteCapacityUnits).toBe(25);
  });

  test("When  deletion policy is retain", () => {
    const table = new dynamo.Table(stack, "MyTable", {
      deletionPolicy: "RETAIN",
    });
    const output = table.synth();
    const { MyTable } = output.resources.Resources;

    expect(MyTable.DeletionPolicy).toBe("RETAIN");
  });
});
