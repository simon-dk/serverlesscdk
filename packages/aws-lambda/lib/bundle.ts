// import * as esbuild from "esbuild";
import { buildSync } from "esbuild";

export class Bundling {
  private currentWorkingDir: string;
  private buildName: string;
  private output: string;
  public readonly handlerPath: string;

  constructor(file: string, functionName: string, handler: string) {
    // const cwd = process.cwd();

    console.time(`Built ${functionName} in`);

    this.currentWorkingDir = process.cwd();
    this.buildName = `build/${functionName}/index.js`;
    this.output = `${this.currentWorkingDir}/${this.buildName}`;
    this.handlerPath = `build/${functionName}/index.${handler}`;

    try {
      buildSync({
        bundle: true,
        entryPoints: [file],
        outfile: this.output,
        platform: "node",
        external: ["aws-sdk"],
        // minify: true,
      });

      console.timeEnd(`Built ${functionName} in`);
    } catch (error) {
      console.log(error.message);
      console.log(this.currentWorkingDir);
      console.log(this.output);
    }
  }
}
