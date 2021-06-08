import { Stack, BaseResource, Region } from "../..";
import { PolicyStatement } from "../../aws-iam";
import {
  HttpApi,
  HttpApiProps,
  HttpJwtAuthorizer,
  HttpJwtAuthorizerProps,
  HttpLambdaAuthorizer,
  HttpLambdaAuthorizerProps,
} from "../../aws-apigatewayv2";
import { DeploymentBucket, DeploymentBucketProps } from ".";

export interface ProviderProps {
  name?: "aws";
  runtime?: string; //nodejs14.x
  stage?: string; //dev # Default stage to be used. Default is "dev"
  region?: string; //us-east-1 # Default region to be used. Default is "us-east-1"
  stackName?: string; //custom-stack-name # Use a custom name for the CloudFormation stack
  apiName?: string; // custom-api-name # Use a custom name for the API Gateway API
  websocketsApiName?: string; //custom-websockets-api-name # Use a custom name for the websockets API
  websocketsApiRouteSelectionExpression?: string; //$request.body.route # custom route selection expression
  profile?: string; //production # The default profile to use with this service
  memorySize?: number; //512 # Overwrite the default memory size. Default is 1024
  timeout?: number; // 10 # The default is 6 seconds. Note: API Gateway current maximum is 30 seconds
  logRetentionInDays?: number; //14 # Set the default RetentionInDays for a CloudWatch LogGroup
  kmsKeyArn?: string; //arn:aws:kms:us-east-1:XXXXXX:key/some-hash # KMS key arn which will be used for encryption for all functions
}

// export enum RetentionDays {
//   ONE_DAY = 1,
//   THREE_DAYS = 3,
//   FIVE_DAYS = 5,
//   ONE_WEEK = 7,
//   TWO_WEEKS = 14,
//   ONE_MONTH = 30,
//   TWO_MONTHS = 60,
//   THREE_MONTHS = 90,
//   FOUR_MONTHS = 120,
//   FIVE_MONTHS = 150,
//   SIX_MONTHS = 180,
//   ONE_YEAR = 365,
//   THIRTEEN_MONTHS = 400,
//   EIGHTEEN_MONTHS = 545,
//   TWO_YEARS = 731,
//   FIVE_YEARS = 1827,
//   TEN_YEARS = 3653,
// }

export class Provider extends BaseResource {
  // static RetentionDays = {
  //   ONE_DAY: 1,
  //   THREE_DAYS: 3,
  //   FIVE_DAYS: 5,
  //   ONE_WEEK: 7,
  //   TWO_WEEKS: 14,
  //   ONE_MONTH: 30,
  //   TWO_MONTHS: 60,
  //   THREE_MONTHS: 90,
  //   FOUR_MONTHS: 120,
  //   FIVE_MONTHS: 150,
  //   SIX_MONTHS: 180,
  //   ONE_YEAR: 365,
  //   THIRTEEN_MONTHS: 400,
  //   EIGHTEEN_MONTHS: 545,
  //   TWO_YEARS: 731,
  //   FIVE_YEARS: 1827,
  //   TEN_YEARS: 3653,
  // };

  public readonly name: string;
  public readonly runtime: string;
  public readonly stage: string;
  public readonly region: string;
  public readonly stackName?: string;
  public readonly apiName?: string;
  public readonly websocketsApiName?: string;
  public readonly websocketsApiRouteSelectionExpression?: string;
  public readonly profile?: string;
  public readonly memorySize?: number;
  public readonly timeout?: number;
  public readonly logRetentionInDays?: number;
  public readonly kmsKeyArn?: string;

  // Properties added with public functions
  public readonly environment: { [k: string]: string } = {};
  public readonly iam: { role: { statements: PolicyStatement[] } } = {
    role: { statements: [] },
  };

  // Temp value
  // More Info: https://www.serverless.com/framework/docs/deprecations/#LAMBDA_HASHING_VERSION_V2
  public readonly lambdaHashingVersion = "20201221";

  constructor(scope: Stack, props: ProviderProps = {}) {
    super(scope, "custom.provider");

    this.name = props.name || "aws";
    this.runtime = props.runtime || "nodejs14.x";
    this.stage = scope.env?.stage || props.stage || "${opt:stage, 'dev'}";
    this.region = scope.env?.region || props.region || Region.US_EAST_1;
    this.stackName = props.stackName;
    this.apiName = props.apiName;
    this.websocketsApiName = props.websocketsApiName;
    this.websocketsApiRouteSelectionExpression = props.websocketsApiRouteSelectionExpression;
    this.profile = scope.env?.profile || props.profile;
    this.memorySize = props.memorySize;
    this.timeout = props.timeout;
    this.logRetentionInDays = props.logRetentionInDays;
    this.kmsKeyArn = props.kmsKeyArn;

    if (props.runtime?.includes("nodejs")) {
      this.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1");
    }
  }

  public addEnvironment(key: string, value: string) {
    this.environment[key] = value;
    return this;
  }

  public addIamStatement(policystatement: PolicyStatement) {
    this.iam.role.statements.push(policystatement);
    return this;
  }

  public addDeploymentBucket(options: DeploymentBucketProps) {
    new DeploymentBucket(this, options);
    return this;
  }

  public addHttpApi(options: HttpApiProps) {
    new HttpApi(this, options);
    return this;
  }

  public addLambdaAuthorizer(id: string, options: HttpLambdaAuthorizerProps) {
    new HttpLambdaAuthorizer(this, id, options);
    return this;
  }

  public addJwtAuthorizer(id: string, options: HttpJwtAuthorizerProps) {
    new HttpJwtAuthorizer(this, id, options);
    return this;
  }

  public synth() {
    return {
      provider: this.synthResource(),
    };
  }
}
