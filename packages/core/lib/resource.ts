import { Fn } from "./fn";
import { Construct } from "./constructor";

export abstract class BaseResource extends Construct {
  protected static validateObject(object: unknown) {
    if (typeof object !== "object") {
      throw new Error("Could not validate because input was not an object");
    }
    if (!object) {
      throw new Error("Object was empty or undefined");
    }
    return object as any;
  }

  protected static getPropertyKeys(object: unknown) {
    const validatedObject = BaseResource.validateObject(object);

    return Object.keys(validatedObject).filter((key) => {
      // Dont return propertykey for "node" object or private properties (starting with "_MyObject": {} )
      if (key === "node") return false;
      if (key.slice(0, 1) === "_") return false;
      const checkForNullValues = validatedObject[key] != null;
      return checkForNullValues;
    });
  }

  protected static getPropertyKeyValues(key: string, object: any) {
    return { [key]: object[key] };
  }

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  /**
   * Synthesizes a node based on either a property (this.MyKey) or the whole node as standard (this).
   * Returns a key/value object
   */
  protected synthResource(object?: unknown) {
    const keys = BaseResource.getPropertyKeys(object || this);
    const keyValuesArray = keys.map((key) => {
      return BaseResource.getPropertyKeyValues(key, object || this);
    });

    return Object.assign({}, ...keyValuesArray);
  }
}

export abstract class Resource extends BaseResource {
  #logicalId: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.#logicalId = id;
  }

  public get logicalId() {
    return this.#logicalId;
  }

  public get arn() {
    return Fn.getAtt(this.#logicalId, "Arn");
  }

  // getAttribute(type: "Arn" | "Name") {
  //   return Fn.getAtt(this.#logicalId, type); //Attribute.getAttribute(this.#logicalId, type);
  // }
}
