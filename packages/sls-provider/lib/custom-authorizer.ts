import { Construct, Resource, FnGetAtt } from "../../";
import { Function } from "../../aws-lambda";

export interface CustomLambdaAuthorizerProps {
  functionName?: string;
  functionArn?: string | FnGetAtt;
  name?: string;
  resultTtlInSeconds?: number;
  enableSimpleResponses?: boolean;
  payloadVersion?: "1.0" | "2.0";
  identitySource?: string[];
  managedExternally?: boolean;
}

export interface ICustomLambdaAuthorizer {
  type: "request";
  functionName?: string;
  functionArn?: string | FnGetAtt;
  name?: string;
  resultTtlInSeconds?: number;
  enableSimpleResponses?: boolean;
  payloadVersion?: "1.0" | "2.0";
  identitySource?: string[];
  managedExternally?: boolean;
}

export class CustomLambdaAuthorizer extends Resource implements ICustomLambdaAuthorizer {
  private static validateTtl(ttl?: number): void {
    if (!ttl) return;
    if (ttl > 3600) throw new Error(`Maximum TTL for custom authorizer is 3600 but got ${ttl}`);
    if (ttl < 0) throw new Error(`TTL cannot be less than 0, got ${ttl}`);
  }

  private static validateFunctionReference(name?: string, arn?: string | FnGetAtt): void {
    if (name && arn)
      throw new Error(
        "You can only supply a name OR an arn for an existing custom authorizer, but supplied both."
      );
  }

  public readonly type: "request";
  public readonly functionName?: string;
  public functionArn?: string | FnGetAtt;
  public readonly name?: string;
  public readonly resultTtlInSeconds?: number;
  public readonly enableSimpleResponses?: boolean;
  public readonly payloadVersion?: "1.0" | "2.0";
  public readonly identitySource?: string[];
  public readonly managedExternally?: boolean;

  private readonly _serverlessId: string;

  constructor(scope: Construct, id: string, props: CustomLambdaAuthorizerProps = {}) {
    const logicalId = `HttpApiAuthorizer${CustomLambdaAuthorizer.buildLogicalId(props.name || id)}`;
    super(scope, logicalId);

    this._serverlessId = id;

    CustomLambdaAuthorizer.validateTtl(props.resultTtlInSeconds);
    CustomLambdaAuthorizer.validateFunctionReference(props.functionName, props.functionArn);

    this.type = "request";
    this.functionName = props.functionName;
    this.functionArn = props.functionArn;
    this.name = props.name;
    this.resultTtlInSeconds = props.resultTtlInSeconds;
    this.enableSimpleResponses = props.enableSimpleResponses;
    this.payloadVersion = props.payloadVersion || "2.0";
    this.identitySource = props.identitySource;
    this.managedExternally = props.managedExternally;
  }

  public addFunction(lambda: Function) {
    if (this.functionArn) {
      throw new Error("You are trying to ad a function that overwrites an existing arn");
    }

    if (lambda instanceof Function) {
      this.functionArn = lambda.arn;
      return this;
    }

    throw new Error("Could not attach lambda to Custom Authorizer");
  }

  public synth() {
    return {
      provider: { httpApi: { authorizers: { [this._serverlessId]: this.synthResource() } } },
    };
  }
}
