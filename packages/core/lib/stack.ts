import { Construct } from "./constructor";

export class Stack extends Construct {
  service: string;
  frameworkVersion: "2";

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.service = id;
    this.frameworkVersion = "2";
  }

  public synth() {
    return {
      service: this.service,
      frameworkVersion: this.frameworkVersion,
    };
  }
}
