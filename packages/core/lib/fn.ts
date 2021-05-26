//Fn functions from here.
//https:docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
//https://github.com/aws/aws-cdk/blob/0ea24e95939412765c0e09133a7793557f779c76/packages/%40aws-cdk/core/lib/cfn-fn.ts#L421

export class Fn {
  static ref(logicalName: string) {
    return new FnRef(logicalName);
  }

  static getAtt(logicalNameOfResource: string, attributeName: string) {
    return new FnGetAtt(logicalNameOfResource, attributeName);
  }
}

/**
 * Simplified FnBase
 */
export class FnBase {
  [k: string]: any;
  constructor(name: string, value: any) {
    this[name] = value;
  }
}

export class FnRef extends FnBase {
  constructor(logicalName: string) {
    super("Ref", logicalName);
  }
}

export class FnGetAtt extends FnBase {
  constructor(logicalNameOfResource: string, attributeName: string) {
    super("Fn::GetAtt", [logicalNameOfResource, attributeName]);
  }
}
