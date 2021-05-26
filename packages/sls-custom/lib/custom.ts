import { Construct } from "../../core";
import { BaseResource } from "../../core";

export interface CustomProps {
  [k: string]: any;
}

export class Custom extends BaseResource {
  [k: string]: any;

  constructor(scope: Construct, props: CustomProps = {}) {
    super(scope, "custom.custom");

    Object.keys(props).map((key) => {
      const value = props[key];
      this[key] = value;
    });
  }

  public addValue(key: string, value: any) {
    this[key] = value;
    return this;
  }

  public synth() {
    return {
      custom: this.synthResource(),
    };
  }
}
