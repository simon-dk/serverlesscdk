import { Construct } from "constructs";
import { Synthesize } from "./private/synthesis";

export class Stage extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  synth() {
    return new Synthesize(this).synth();
  }
}
