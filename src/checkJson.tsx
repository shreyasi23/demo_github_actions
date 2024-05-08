import JSZip from "jszip";
import Widget from "../Widget";
import { processSetUp } from "../processSetUp";

const checkJSONB = async (jsonObj, expRes) => {
  let ids: string[] = [];
  const getID = (obj: any) => {
    for (let key in obj) {
      // console.log(key);
      if (obj.hasOwnProperty(key)) {
        if (key === "id") {
          ids.push(obj[key]);
        } else if (typeof obj[key] === "object" && key !== "masterComponent") {
          getID(obj[key]);
        }
      }
    }
    // console.log("ids: ",ids);
  };

  getID(jsonObj);

  let propsObj = [];
  processSetUp(jsonObj);
  const postProcess = new Widget(jsonObj);
  try {
    await postProcess.processTree(
      true,
      JSZip,
      postProcess.absoluteBoundingBox.x,
      postProcess.absoluteBoundingBox.y
    );
  } catch (e) {
    console.error(e);
  }

  // const input = new Widget(jsonObj);
  let group, category, p_children;
  let p_children_name = [];
  for (let i = 0; i < ids.length; i++) {
    let n = postProcess.traverseTillProp(ids[i], "id");
    if (n.first_children) {
      group = n.first_children;
    } else {
      group = null;
    }
    category = n.category;
    if (n.processedChildren.length > 0) {
      p_children = n.processedChildren;
      for (let j = 0; j < p_children.length; j++) {
        p_children_name[j] = p_children[j].name;
      }
    } else {
      p_children = null;
    }

    let obj = {
      id: ids[i],
      grp: group,
      cat: category,
      pcn: p_children_name,
    };
    propsObj.push(obj);
    p_children_name = [];
  }
  console.log(propsObj);

  // for (let i = 0; i < expRes.length; i++) {
  //   if (expRes[i].id === propsObj[i].id) {
  //     if (expRes[i].grp !== propsObj[i].grp) {
  //       console.log("grouping incorrect for ", propsObj[i].id);
  //     }
  //     if (expRes[i].cat !== propsObj[i].cat) {
  //       console.log("category incorrect for ", propsObj[i].id);
  //     }
  //   }
  // }
};

export default checkJSONB;
