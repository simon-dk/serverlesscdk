import { App, Stack } from "..";

describe("basic app", () => {
  test("If app is a parent", () => {
    const app = new App();
    expect(app.node.id).toBe("");
  });
});

test("Creating an app and a stack", () => {
  const app = new App();
  const stack = new Stack(app, "myStack");
  expect(stack.node.id).toBe("myStack");
});
