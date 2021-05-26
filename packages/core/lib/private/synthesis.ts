import { IConstruct } from "constructs";
import { merge } from "lodash";
/** import custom construct with synth property */
import { Construct as _Construct } from "../constructor";

// Quick and dirty synthesizer. Move this to a private folder.
// Make a warning if a property overwrites another property!
export class Synthesize {
  private static getSynthesizebleChildren(root: IConstruct) {
    const children = root.node.findAll();
    return children.filter((child) => child instanceof _Construct) as _Construct[];
  }

  private readonly tree: object;
  private readonly root: IConstruct;
  private readonly children: _Construct[];

  constructor(root: IConstruct) {
    this.tree = {};
    this.root = root;
    this.children = Synthesize.getSynthesizebleChildren(this.root);
  }

  private synthesizeChild(child: _Construct) {
    return child.synth();
  }

  private buildTree() {
    for (const child of this.children) {
      const synthesizedChild = this.synthesizeChild(child);
      merge(this.tree, synthesizedChild);
    }
  }

  public synth() {
    this.buildTree();
    return this.tree;
  }
}
