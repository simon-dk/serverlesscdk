import { Construct } from "./constructor";
import { Package } from "../../";

export interface Environment {
  region?: string;
  stage?: string;
  profile?: string;
}

export interface StackProps {
  /**
   * creates a package with pattern "!./**" so nothing is included in lambda deployments be default.
   * Set to false if this behavior is not needed
   */
  packageIndividually?: boolean;

  /**
   * region, stage and profile variables that
   * will automatically be used by "Provider".
   * Provider construct is not created
   */
  env?: Environment;
}

export class Stack extends Construct {
  public readonly service: string;
  public readonly frameworkVersion: "2";
  public readonly env?: Environment;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id);

    this.service = id;
    this.frameworkVersion = "2";

    if (props.packageIndividually !== false) {
      this.addPackage();
    }

    this.env = props.env;
  }

  private addPackage() {
    new Package(this, { individually: true, patterns: ["!./**"] });
  }

  public synth() {
    return {
      service: this.service,
      frameworkVersion: this.frameworkVersion,
    };
  }
}
