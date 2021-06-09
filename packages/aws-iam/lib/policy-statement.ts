// readonly sid?: string;
// readonly notActions?: string[];
// readonly principals?: IPrincipal[];
// readonly notPrincipals?: IPrincipal[];
// readonly notResources?: string[];
// readonly conditions?: { [key: string]: any };

export interface PolicyStatementProps {
  /**
   * @default Allow
   */
  readonly effect?: Effect;
  readonly actions?: string[];
  // readonly notActions?: string | string[];
  readonly resources?: any[];
}

export interface IPolicyStatement {
  readonly Effect: Effect;
  readonly Action: any[];
  readonly Resource: any[];
  readonly NotAction?: any[];
  readonly NotResource?: any[];
}

export enum Effect {
  ALLOW = "Allow",
  DENY = "Deny",
}

export class PolicyStatement implements IPolicyStatement {
  public static ALLOW = Effect.ALLOW;
  public static DENY = Effect.DENY;

  private static validateAction(action: string) {
    const regex = new RegExp(/^(\*|[a-zA-Z0-9-]+:[a-zA-Z0-9*]+)$/);
    if (!action.match(regex)) {
      throw new Error(
        `Action '${action}' is invalid. An action string consists of a service namespace, a colon, and the name of an action. Action names can include wildcards.`
      );
    }
  }

  public readonly Effect: Effect;
  public readonly Action: any[] = [];
  public readonly NotAction?: any[];
  public readonly Resource: any[] = [];
  public readonly NotResource?: any[];

  constructor(props: PolicyStatementProps = {}) {
    this.Effect = props.effect || Effect.ALLOW;
    this.addActions(...(props.actions || []));
    this.addResources(...(props.resources || []));
  }

  public addActions(...actions: string[]) {
    if (actions.length > 0 && this.NotAction && this.NotAction.length > 0) {
      throw new Error("Cannot add 'Actions' to policy statement if 'NotActions' have been added");
    }

    actions.map(PolicyStatement.validateAction);
    this.Action.push(...actions);
  }

  public addResources(...arns: string[]) {
    if (arns.length > 0 && this.NotResource && this.NotResource.length > 0) {
      throw new Error(
        "Cannot add 'Resources' to policy statement if 'NotResources' have been added"
      );
    }
    this.Resource.push(...arns);
  }
}
