import { PolicyStatement } from "../";

describe("Policy Statement unit tests", () => {
  test("A policy with correct values", () => {
    const statement = new PolicyStatement({ actions: ["s3:ListBucket"], resources: ["*"] });
    expect(statement.Effect).toBe("Allow");
    expect(statement.Action[0]).toBe("s3:ListBucket");
    expect(statement.Resource[0]).toBe("*");
  });

  test("A policy with incorrect formatted action", () => {
    expect(() => {
      new PolicyStatement({ actions: ["incorrect-action"], resources: ["*"] });
    }).toThrow();
  });

  test("A policy with a wildcard action", () => {
    const statement = new PolicyStatement({ actions: ["*"], resources: ["*"] });

    expect(statement.Effect).toBe("Allow");
    expect(statement.Action[0]).toBe("*");
    expect(statement.Resource[0]).toBe("*");
  });

  test("If a deny effect works", () => {
    const statement = new PolicyStatement({
      effect: PolicyStatement.DENY,
    });

    expect(statement.Effect).toBe("Deny");
  });
});
