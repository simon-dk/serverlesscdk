import { Construct, Resource, Provider } from "../..";
import { Bundling, BundlingOptions } from "./bundle";

type Tags = any;
type securityGroupIds = string[];
type subnetIds = string[];
type Vpc = { securityGroupIds: securityGroupIds; subnetIds: subnetIds };
type Destinations = any;
type Event = any;
type Patterns = string[];
type Package = { patterns?: Patterns; artifact?: string; individually?: boolean };
type Environment = any;

export interface IFunction {
  name?: string;
  description?: string;
  memorySize?: number | string;
  reservedConcurrency?: number | string;
  provisionedConcurrency?: number | string;
  runtime?: string;
  timeout?: number | string;
  role?: string;
  onError?: string;
  awsKmsKeyArn?: string;
  environment?: Environment;
  tags?: Tags;
  vpc?: string | Vpc;
  package?: Package;
  layers?: Array<string | Record<string, string>>;
  tracing?: "Active" | "PassThrough";
  condition?: string;
  dependsOn?: string[];
  destinations?: Destinations;
  events?: Event[];
  image?: string;
  handler: string;
}

export interface FunctionProps {
  name?: string;
  description?: string;
  memorySize?: number | string;
  reservedConcurrency?: number | string;
  provisionedConcurrency?: number | string;
  runtime?: string;
  timeout?: number | string;
  role?: string;
  onError?: string;
  awsKmsKeyArn?: string;
  environment?: Environment;
  tags?: Tags;
  vpc?: string | Vpc;
  package?: Package;
  layers?: Array<string | Record<string, string>>;
  tracing?: "Active" | "PassThrough";
  condition?: string;
  dependsOn?: string[];
  destinations?: Destinations;
  events?: Event[];
  image?: string;
  handler: string;
  entryfile?: string;
  bundlingOptions?: BundlingOptions;
}

export class Function extends Resource implements IFunction {
  public readonly name?: string;
  public readonly description?: string;
  public readonly memorySize?: number | string;
  public readonly reservedConcurrency?: number | string;
  public readonly provisionedConcurrency?: number | string;
  public readonly runtime?: string;
  public readonly timeout?: number | string;
  public readonly role?: string;
  public readonly onError?: string;
  public readonly awsKmsKeyArn?: string;
  public readonly environment?: Environment;
  public readonly tags?: Tags;
  public readonly vpc?: string | Vpc;
  public readonly package?: Package;
  public readonly layers?: Array<string | Record<string, string>>;
  public readonly tracing?: "Active" | "PassThrough";
  public readonly condition?: string;
  public readonly dependsOn?: string[];
  public readonly destinations?: Destinations;
  public readonly events?: Event[];
  public readonly image?: string;
  public readonly handler: string;

  // Because Serverless appends "LambdaFunction" to all names, we save the
  // original Id as a private property.
  private readonly _serverlessId: string;

  constructor(scope: Construct, id: string, props: FunctionProps) {
    const logicalId = Function.buildLogicalId(id, "LambdaFunction");
    super(scope, logicalId);

    this._serverlessId = id;
    this.name = props.name; //does this conflict with id?
    this.description = props.description;
    this.memorySize = props.memorySize;
    this.reservedConcurrency = props.reservedConcurrency;
    this.provisionedConcurrency = props.provisionedConcurrency;
    this.runtime = props.runtime;
    this.timeout = props.timeout;
    this.role = props.role;
    this.onError = props.onError;
    this.awsKmsKeyArn = props.awsKmsKeyArn;
    this.environment = props.environment || {};
    this.tags = props.tags;
    this.vpc = props.vpc;
    this.package = props.package;
    this.layers = props.layers;
    this.tracing = props.tracing;
    this.condition = props.condition;
    this.dependsOn = props.dependsOn;
    this.destinations = props.destinations;
    this.events = props.events;
    this.image = props.image;
    this.handler = props.handler;

    if (props.entryfile) {
      // console.log(scope.node.findAll().filter((child) => child.node.id === "custom.provider"));
      const { buildName, handlerPath } = this.bundleCode(props.entryfile, id, props.handler, {
        ...props.bundlingOptions,
        target: props.runtime || this.getProviderRuntime(scope),
      });
      //Create or use existing package pattern and push buildName to patterns
      this.package = this.package || { individually: true, patterns: [] };
      this.package.patterns?.push(buildName);
      this.handler = handlerPath;
    }

    if (props.runtime?.includes("nodejs")) {
      this.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1");
    }
  }

  private getProviderRuntime(scope: Construct) {
    try {
      const providerNode = scope.node.findChild("custom.provider") as Provider;
      return providerNode.runtime;
    } catch (error) {
      throw new Error(
        "Could not extract a node runtime as there is no provider in the stack and runtime is not configured on the function."
      );
    }
  }

  private bundleCode(
    entryFile: string,
    functionName: string,
    handler: string,
    bundlingOptions?: BundlingOptions
  ) {
    //#Todo make further validation
    return new Bundling(entryFile, functionName, handler, bundlingOptions);
  }

  public addEnvironment(key: string, value: string) {
    this.environment[key] = value;
    return this;
  }

  synth() {
    //We use _serverlessId to avoid functions named "getUserLambdaFunctionLambdaFunction"
    return { functions: { [this._serverlessId]: this.synthResource() } };
  }
}
