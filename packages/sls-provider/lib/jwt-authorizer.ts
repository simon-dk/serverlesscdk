import { Construct, Resource } from "../../";

export interface JwtAuthorizerProps {
  readonly issuerUrl: string;
  readonly audience: string[];
  /**
   * @default $request.header.Authorization
   */
  readonly identitySource?: string;
}

export interface IJwtAuthorizer {
  readonly issuerUrl: string;
  readonly audience: string[];
  readonly identitySource: string;
}

export class JwtAuthorizer extends Resource implements IJwtAuthorizer {
  public readonly issuerUrl: string;
  public readonly audience: string[];
  public readonly identitySource: string;

  private readonly _serverlessId: string;

  constructor(scope: Construct, id: string, props: JwtAuthorizerProps) {
    const logicalId = `HttpApiAuthorizer${JwtAuthorizer.buildLogicalId(id)}`;
    super(scope, logicalId);

    this._serverlessId = id;

    // Add validation to these
    this.issuerUrl = props.issuerUrl;
    this.audience = props.audience;

    this.identitySource = props.identitySource ?? "$request.header.Authorization";
  }

  public synth() {
    console.log(this);
    return {
      provider: { httpApi: { authorizers: { [this._serverlessId]: this.synthResource() } } },
    };
  }
}
