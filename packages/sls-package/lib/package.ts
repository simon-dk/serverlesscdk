import { Construct, BaseResource } from "@serverlesscdk/core";

export interface PackageProps {
  readonly patterns?: string[];
  readonly excludeDevDependencies?: boolean;
  readonly artifact?: string;
  readonly individually?: boolean;
}

export interface IPackage {
  readonly patterns?: string[];
  readonly excludeDevDependencies?: boolean;
  readonly artifact?: string;
  readonly individually?: boolean;
}

export class Package extends BaseResource implements IPackage {
  public readonly patterns?: string[];
  public readonly excludeDevDependencies?: boolean;
  public readonly artifact?: string;
  public readonly individually?: boolean;

  constructor(scope: Construct, props: PackageProps = {}) {
    super(scope, "custom.package");

    this.patterns = props.patterns;
    this.excludeDevDependencies = props.excludeDevDependencies;
    this.artifact = props.artifact;
    this.individually = props.individually;
  }

  public synth() {
    return {
      package: this.synthResource(),
    };
  }
}

// package: # Optional deployment packaging configuration
//   patterns: # Specify the directories and files which should be included in the deployment package
//     - src/**
//     - handler.js
//     - '!.git/**'
//     - '!.travis.yml'
//   excludeDevDependencies: false # Config if Serverless should automatically exclude dev dependencies in the deployment package. Defaults to true
//   artifact: path/to/my-artifact.zip # Own package that should be used. You must provide this file.
//   individually: true # Enables individual packaging for each function. If true you must provide package for each function. Defaults to false
