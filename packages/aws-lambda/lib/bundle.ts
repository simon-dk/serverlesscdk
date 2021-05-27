import { buildSync } from "esbuild";

export interface BundlingOptions {
  // outfile?: string;
  external?: string[];
  minify?: boolean;
  target?: string;
}

export class Bundling {
  private static toTarget(runtime: string = "esnext") {
    if (runtime === "esnext") {
      return runtime;
    }

    const match = runtime.match(/nodejs(\d+)/);

    if (!match) {
      throw new Error("Cannot extract node-version from runtime.");
    }

    return `node${match[1]}`;
  }

  private readonly currentWorkingDir: string;
  private readonly output: string;
  public readonly buildName: string;
  public readonly handlerPath: string;

  constructor(file: string, functionName: string, handler: string, props: BundlingOptions = {}) {
    console.time(`Built ${functionName} in`);

    this.currentWorkingDir = process.cwd();
    this.buildName = `build/${functionName}/index.js`;
    this.output = `${this.currentWorkingDir}/${this.buildName}`;
    this.handlerPath = `build/${functionName}/index.${handler}`;

    const external: string[] = props.external ? [...props.external, "aws-sdk"] : ["aws-sdk"];

    try {
      buildSync({
        bundle: true,
        entryPoints: [file],
        outfile: this.output,
        platform: "node",
        external: external,
        minify: props.minify ?? false,
        target: Bundling.toTarget(props.target),
      });

      console.timeEnd(`Built ${functionName} in`);
    } catch (error) {
      throw new Error(`Bundling failed with message: ${error.message}`);
    }
  }
}
