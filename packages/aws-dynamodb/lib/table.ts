import { Construct, Resource } from "../../";

export interface Tag {
  Key: string;
  Value: string;
}

export interface KeySchema {
  AttributeName: string;
  KeyType: "HASH" | "RANGE";
}

export interface IAttributeDefinition {
  AttributeName: string;
  AttributeType: "S" | "N" | "B";
}

export interface TableProperties {
  TableName: string;
  BillingMode: "PROVISIONED" | "PAY_PER_REQUEST";
  AttributeDefinitions: IAttributeDefinition[];
  KeySchema: KeySchema[];
  ProvisionedThroughput?: { ReadCapacityUnits: number; WriteCapacityUnits: number };
}

export interface ITable {
  TableName: string;
  BillingMode: "PROVISIONED" | "PAY_PER_REQUEST";
  AttributeDefinitions: IAttributeDefinition[];
  KeySchema: KeySchema[];
  ProvisionedThroughput?: { ReadCapacityUnits: number; WriteCapacityUnits: number };
}

export interface TableProps {
  partitionKey?: { name: string; type: "S" | "N" | "B" };
  sortKey?: { name: string; type: "S" | "N" | "B" };
  billingMode?: "PROVISIONED" | "PAY_PER_REQUEST";
  readCapacity?: number;
  writeCapacity?: number;
  deletionPolicy?: "RETAIN";
  tags?: Tag[];
}

export class Table extends Resource implements ITable {
  public readonly TableName: string;
  public readonly BillingMode: "PROVISIONED" | "PAY_PER_REQUEST";
  public readonly AttributeDefinitions: IAttributeDefinition[] = [];
  public readonly KeySchema: KeySchema[] = [];
  public readonly ProvisionedThroughput?: { ReadCapacityUnits: number; WriteCapacityUnits: number };

  private readonly _deletionPolicy?: "RETAIN";

  constructor(scope: Construct, id: string, props: TableProps = {}) {
    super(scope, id);

    this.TableName = id;
    this.BillingMode = props.billingMode ?? "PAY_PER_REQUEST";

    this.addKey(props.partitionKey?.name || "PK", "HASH");
    this.addAttributeDefinition(props.partitionKey?.name || "PK", props.partitionKey?.type || "S");

    if (props.sortKey) {
      this.addKey(props.sortKey.name, "RANGE");
      this.addAttributeDefinition(props.sortKey.name, props.sortKey.type);
    }

    this.ProvisionedThroughput =
      this.BillingMode === "PAY_PER_REQUEST"
        ? undefined
        : {
            ReadCapacityUnits: props.readCapacity || 5,
            WriteCapacityUnits: props.writeCapacity || 5,
          };

    this._deletionPolicy = props.deletionPolicy || undefined;
  }

  private addKey(name: string, type: "HASH" | "RANGE") {
    this.KeySchema.push({ AttributeName: name, KeyType: type });
  }

  private addAttributeDefinition(name: string, type: "S" | "N" | "B") {
    this.AttributeDefinitions.push({ AttributeName: name, AttributeType: type });
  }

  synth() {
    return {
      resources: {
        Resources: {
          [this.logicalId]: {
            Type: "AWS::DynamoDB::Table",
            Properties: this.synthResource(),
            DeletionPolicy: this._deletionPolicy,
          },
        },
      },
    };
  }
}

// export const dynamoDbTable = new Resource("Database", {
//   Type: "AWS::DynamoDB::Table",
//   DeletionPolicy: "Retain",
//   Properties: {
//     TableName: "flyers_table",
//     BillingMode: "PROVISIONED", //PAY_PER_REQUEST

//     AttributeDefinitions: [
//       { AttributeName: "PK", AttributeType: "S" },
//       { AttributeName: "SK", AttributeType: "S" },
//     ],
//     KeySchema: [
//       { AttributeName: "PK", KeyType: "HASH" },
//       { AttributeName: "SK", KeyType: "RANGE" },
//     ],
//     ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
//     Tags: [{ Key: "Service", Value: "flyers" }],
//   },
// });
