import Widget from "./Widget";

// This function categorizes the node and gets the parent name if it is an instance for accurate component naming.
function categorize(node: Widget): void {
  switch (node.type) {
    case "TEXT":
      node.category = "label";
      break;
    case "INSTANCE":
      node.category = node.masterComponent.parent
        ? node.masterComponent.parent.name === "Container"
          ? node.masterComponent.name
          : node.masterComponent.parent.name
        : node.masterComponent.name;
      if (
        node.category.toLowerCase() === "light scheme" ||
        (node.category.toLowerCase().includes("building blocks") &&
          !node.category.toLowerCase().includes("/"))
      ) {
        node.category = node.masterComponent.name;
      }

      const iconCheck = node.traverseTillProp("TEXT", "type");

      // This checks the following:
      // 1. The Icon is a square
      // 2. It is a font
      // 3. It is the used iconFont
      if (
        node.w === node.h &&
        iconCheck !== undefined &&
        iconCheck.fontObject &&
        iconCheck.fontObject.fontName.family === "fisfont-regular"
      ) {
        node.category = "textIcon";
      }
      // if (!knownMarkupCats.includes(node.category.toLowerCase())) {
      //   node.category = "PARTIAL";
      // }
      break;
    case "RECTANGLE":
      if (node.fills && node.fills[0].type === "IMAGE") {
        node.category = "image";
      } else {
        node.category = "container";
      }
      break;
    case "ELLIPSE":
      node.category = "circular container";
      break;
    case "FRAME":
      if (node.fills && node.fills[0] && node.fills[0].type === "IMAGE") {
        node.category = "bgframe";
      } else {
        node.category = "frame";
      }
      break;
    case "VECTOR":
      node.category = "icons";
      break;
    case "BOOLEAN_OPERATION":
      node.category = "icons";
      break;
    case "GROUP":
      node.category = "group";
      break;
    case "LINE":
      node.category = "divider-intermediate";
      break;
    default:
      node.category = "PARTIAL";
  }
}

export default categorize;
