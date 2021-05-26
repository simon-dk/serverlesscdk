import { Construct as _Construct } from "constructs";

/**
 * Create an abstract class with a synth property for all resources to use.
 */
abstract class Construct extends _Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  public abstract synth(): object;
}

export { Construct };
