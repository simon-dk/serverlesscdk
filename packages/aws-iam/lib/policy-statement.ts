// readonly sid?: string;
// readonly notActions?: string[];
// readonly principals?: IPrincipal[];
// readonly notPrincipals?: IPrincipal[];
// readonly notResources?: string[];
// readonly conditions?: { [key: string]: any };

export interface PolicyStatementProps {
  readonly actions?: string[];
  readonly resources?: string[];
  readonly effect?: Effect;
}

export class PolicyStatement {
  public readonly effect: Effect;
  public readonly action: any[] = [];
  public readonly notAction: any[] = [];
  public readonly resource: any[] = [];
  public readonly notResource: any[] = [];

  constructor(props: PolicyStatementProps = {}) {
    this.effect = props.effect || Effect.ALLOW;
    this.addActions(...(props.actions || []));
    this.addResources(...(props.resources || []));
  }

  public addActions(...actions: string[]) {
    if (actions.length > 0 && this.notAction.length > 0) {
      throw new Error("Cannot add 'Actions' to policy statement if 'NotActions' have been added");
    }
    this.action.push(...actions);
  }

  public addResources(...arns: string[]) {
    if (arns.length > 0 && this.notResource.length > 0) {
      throw new Error(
        "Cannot add 'Resources' to policy statement if 'NotResources' have been added"
      );
    }
    this.resource.push(...arns);
  }
}

export enum Effect {
  ALLOW = "Allow",
  DENY = "Deny",
}
