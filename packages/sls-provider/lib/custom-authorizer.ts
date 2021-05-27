import { Construct, BaseResource, FnGetAtt } from "../../";

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

export class CustomLambdaAuthorizer extends BaseResource implements ICustomLambdaAuthorizer {
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

  #logicalId: string;
  type: "request";
  functionName?: string;
  functionArn?: string | FnGetAtt;
  name?: string;
  resultTtlInSeconds?: number;
  enableSimpleResponses?: boolean;
  payloadVersion?: "1.0" | "2.0";
  identitySource?: string[];
  managedExternally?: boolean;

  constructor(scope: Construct, id: string, props: CustomLambdaAuthorizerProps) {
    super(scope, id);

    this.#logicalId = id;

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
  synth() {
    return { provider: { httpApi: { authorizers: { [this.#logicalId]: this.synthResource() } } } };
  }
}
