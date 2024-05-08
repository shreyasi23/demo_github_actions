import categorize from "./categorize";
import JSZip from "jszip";

class Widget {
  absoluteBoundingBox?: { [key: string]: number };
  absoluteBoundingBoxCalc?: { [key: string]: number };
  id?: string;
  type?: string;
  name: string;
  characters?: string;
  fills?: readonly Paint[];
  strokes?: readonly Paint[];
  componentProperties?: ComponentProperties;
  inferredAutoLayout?: InferredAutoLayoutResult;
  inferredAutoLayoutML?: {
    layoutMode: "HORIZONTAL" | "VERTICAL";
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    spacing: number | string;
  };
  parentNodeType?: string;
  parentNodeId?: string;
  parent: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  fontName?: FontName;
  effects?: Array<DropShadowEffect>;
  masterComponent?: ComponentNode;
  children?: FrameNode[];
  processedChildren?: Array<Widget>;
  category?: string;
  markup?: string;
  css?: { [key: string]: string };
  fontObject: Partial<TextStyle>;
  layoutSizingVertical?: string;
  layoutSizingHorizontal?: string;
  parentNodeCSS?: { [key: string]: string };
  relativeBoundingBox: { [key: string]: Number | string };
  rotation?: number | undefined;

  /**
   * The constructor function initializes properties of a class instance based on a given node object,
   * including assigning the node's name and fontObject properties.
   * @param {any} node - The `node` parameter is an object that represents a node in a tree structure. It
   * contains various properties that describe the node, such as its name, type, and font object. The
   * constructor function is used to create a new instance of a class and initialize its properties based
   * on the provided `node
   */
  constructor(node: any) {
    this.name = "";
    this.fontObject = {};
    try {
      Object.assign(this, node);
      this.name = node.name;
      if (!("processedChildren" in node)) {
        this.processedChildren = [];
      }
      if (node.type === "TEXT") {
        this.fontObject = node.fontObject;
      } else {
        node.fontObject = {};
      }
    } catch (e) {
      console.error("An error occurred while creating Widgets: ", node);
    }
  }

  /**
   * The `processTree` function processes a tree structure of nodes, calculates bounding box values,
   * categorizes nodes, generates markup, and recursively processes child nodes.
   * @param {boolean} keepCategories - A boolean value indicating whether the current process is for a theme or
   * not.
   * @param {JSZip} file - The `file` parameter is of type `JSZip`, which is a library for creating,
   * reading, and editing ZIP files in JavaScript. It is used in this code to generate markup and perform
   * other operations on the file.
   * @param {number} pagex - The `pagex` parameter represents the x-coordinate of the current page.
   * @param {number} pagey - The `pagey` parameter represents the y-coordinate of the current page. It is
   * used to calculate the absolute y-coordinate of the widget by subtracting the `pagey` value from the
   * `absoluteBoundingBox.y` value.
   * @returns a Promise that resolves to void (i.e., no value).
   */
  async processTree?(
    keepCategories: boolean,
    file: JSZip,
    pagex: number,
    pagey: number,
  ): Promise<void> {
    this.relativeBoundingBox = {
      x: this.x ?? 10,
      y: this.y ?? 10,
      w: this.w ?? 10,
      h: this.h ?? 10,
    };
    this.absoluteBoundingBoxCalc = {
      x: Math.abs(this.absoluteBoundingBox!.x - pagex),
      y: Math.abs(this.absoluteBoundingBox!.y - pagey),
      w: this.w ?? 10,
      h: this.h ?? 10,
    };
    if (!this.children || this.children.length === 0) {
      if (!keepCategories) {
        categorize(this);
      }
      return;
    } else if (this.children.length !== 0) {
      const nodeWidget = new Widget(this.children[0]);
      if (this.processedChildren){
        this.processedChildren.push(nodeWidget)
      } else {
        this.processedChildren = [];
        this.processedChildren.push(nodeWidget);
      }
      this.children.shift();
      await nodeWidget.processTree(keepCategories, file, pagex, pagey);
    }
    await this.processTree(keepCategories, file, pagex, pagey);
  }

  /**
   * The function `traverseTillProp` recursively searches for a specific property value in a tree-like
   * structure of `Widget` objects.
   * @param {string} targetValue - The `targetValue` parameter is a string that represents the value we
   * are searching for in the `propertyName` of the `Widget` object.
   * @param propertyName - The `propertyName` parameter is the name of the property in the `Widget`
   * object that you want to traverse and search for. It should be a valid key of the `Widget` interface.
   * @returns The function `traverseTillProp` returns a `Widget` object or `undefined`.
   */
  traverseTillProp?(
    targetValue: string,
    propertyName: keyof Widget,
  ): Widget | undefined {
    let widget: Widget | undefined = undefined;
    if (this[propertyName] === targetValue) {
      return this;
    }
    if (this.processedChildren?.length !== 0 && this.processedChildren) {
      for (const child of this.processedChildren) {
        widget = child.traverseTillProp(targetValue, propertyName);
        if (widget) {
          break;
        }
      }
    }
    return widget;
  }

  /**
   * The function `getAllWithKey` recursively searches for objects with a specific value for a given key
   * and returns an array of all matching objects.
   * @param {string} targetValue - The `targetValue` parameter is a string that represents the value you
   * want to search for in the `key` property of the `Widget` objects.
   * @param {string} key - The `key` parameter is a string that represents the property name of the
   * object that we want to check for the target value.
   * @returns an array of Widget objects that have a specific target value for a given key.
   */
  getAllWithKey?(targetValue: string, key: string): Widget[] {
    let allTargets = [];
    if (this[key] === targetValue) {
      allTargets.push(this);
    }
    if (
      this.processedChildren !== undefined &&
      this.processedChildren.length > 0
    ) {
      for (const i of this.processedChildren) {
        const targetsFromChild = i.getAllWithKey(targetValue, key);
        allTargets = allTargets.concat(targetsFromChild);
      }
    }
    return allTargets;
  }


  // test function
  getAll?(predicate: (node: Widget) => boolean): Widget[] {
    const allWidgets: Widget[] = [];

    function collectWidgets(node: Widget) {
      if (predicate(node)) {
        allWidgets.push(node);
      }
      if (node.processedChildren) {
        node.processedChildren.forEach(collectWidgets);
      }
    }

    collectWidgets(this);

    return allWidgets;
  }
}

export default Widget;
