import { BaseResource } from "../lib/resource";

class TestResource extends BaseResource {
  private _secret: string;
  public name: string;

  constructor() {
    super(undefined as any, "");
    this._secret = "This is a secret";
    this.name = "Simon";
  }
  synth() {
    return this.synthResource();
  }
}

test("BaseResourse Synth", () => {
  const resource = new TestResource();
  expect(resource.synth()._secret).toBe(undefined);
  expect(resource.synth().name).toBe("Simon");
});
