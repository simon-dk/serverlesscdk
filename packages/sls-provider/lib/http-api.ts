import { Construct, BaseResource } from "../../core";
import { CustomLambdaAuthorizer, CustomLambdaAuthorizerProps } from ".";

export interface HttpApiProps {
  id?: string; // : 'my-id' # If we want to attach to externally created HTTP API its id should be provided here
  name?: string; // : 'dev-my-service' # Use custom name for the API Gateway API, default is ${sls:stage}-${self:service}
  payload?: "1.0" | "2.0"; // : '2.0' # Specify payload format version for Lambda integration ('1.0' or '2.0'), default is '2.0'
  cors?: boolean;
}

export interface IHttpApi {
  id?: string;
  name?: string;
  payload: "1.0" | "2.0";
  cors: boolean;
}

export class HttpApi extends BaseResource implements IHttpApi {
  id?: string;
  name?: string;
  payload: "1.0" | "2.0";
  cors: boolean;
  constructor(scope: Construct, props: HttpApiProps = {}) {
    super(scope, "custom.provider.httpApi");

    this.id = props.id;
    this.name = props.name;
    this.payload = props.payload || "2.0";
    this.cors = props.cors || false;
  }

  public addCustomAuthorizer(id: string, options: CustomLambdaAuthorizerProps) {
    new CustomLambdaAuthorizer(this, id, options);
    return this;
  }

  synth() {
    return { provider: { httpApi: this.synthResource() } };
  }
}
