import Widget from "./Widget";

export const processSetUp = (
    obj: Object & { processedChildren?: Widget[]; parent: string },
  ) => {
    if ("processedChildren" in obj && obj.processedChildren.length > 0) {
      for (const child of obj.processedChildren) {
        processSetUp(child);
      }
      Object.assign(obj, {
        children: obj.processedChildren,
        parentNodeId: obj.parent,
      });
      delete obj.processedChildren;
    } else {
      Object.assign(obj, {
        children: obj.processedChildren,
        parentNodeId: obj.parent,
      });
      delete obj.processedChildren;
    }
  };
  