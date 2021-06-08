import { Construct, Resource } from "../../..";

export interface HttpJwtAuthorizerProps {
  readonly issuerUrl: string;
  readonly audience: string[];
  /**
   * @default $request.header.Authorization
   */
  readonly identitySource?: string[];
}

export interface IHttpJwtAuthorizer {
  readonly issuerUrl: string;
  readonly audience: string[];
  readonly identitySource: string[];
}

export class HttpJwtAuthorizer extends Resource implements IHttpJwtAuthorizer {
  public readonly issuerUrl: string;
  public readonly audience: string[];
  public readonly identitySource: string[];

  private readonly _serverlessId: string;

  constructor(scope: Construct, id: string, props: HttpJwtAuthorizerProps) {
    const logicalId = `HttpApiAuthorizer${HttpJwtAuthorizer.buildLogicalId(id)}`;
    super(scope, logicalId);

    this._serverlessId = id;

    // Add validation to these
    this.issuerUrl = props.issuerUrl;
    this.audience = props.audience;

    this.identitySource = props.identitySource ?? ["$request.header.Authorization"];
  }

  public synth() {
    return {
      provider: { httpApi: { authorizers: { [this._serverlessId]: this.synthResource() } } },
    };
  }
}
