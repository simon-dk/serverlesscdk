import { Construct } from "../../core";
import { BaseResource } from "../../core";

export interface PluginProps {
  plugins?: string[];
}

export class Plugins extends BaseResource {
  plugins: string[] = [];

  constructor(scope: Construct, props: PluginProps = {}) {
    super(scope, "custom.plugins");
    this.plugins = props.plugins || [];
  }

  public addPlugin(plugin: string) {
    this.plugins.push(plugin);
    return this;
  }

  public synth() {
    return {
      plugins: this.plugins,
    };
  }
}
