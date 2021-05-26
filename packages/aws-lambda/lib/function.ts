import { Construct, Resource } from "../..";
import { Bundling } from "./bundle";

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
    const logicalId = `${id}LambdaFunction`;
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

    this.handler = props.entryfile
      ? (this.handler = this.bundleCode(props.entryfile, id, props.handler))
      : props.handler;

    if (props.runtime?.includes("nodejs")) {
      this.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1");
    }
  }

  public addEnvironment(key: string, value: string) {
    this.environment[key] = value;
    return this;
  }

  private bundleCode(file: string, functionName: string, handler: string) {
    //#Todo make further validation
    const bundle = new Bundling(file, functionName, handler);
    if (this.package?.individually === false) {
      console.log(
        "You should consider packaging functions individually and using patterns when bundling with esbuild."
      );
    }
    return bundle.handlerPath;
  }

  synth() {
    //We use _serverlessId to avoid functions named "getUserLambdaFunctionLambdaFunction"
    return { functions: { [this._serverlessId]: this.synthResource() } };
  }
}
