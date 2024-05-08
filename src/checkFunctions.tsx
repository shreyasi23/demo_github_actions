import Widget from "../Widget";

// fucntion to get node ID
const getID = (obj, a) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === "id") {
        a.push(obj[key]);
      } else if (key === "processedChildren") {
        let objArr: object[] = obj[key];
        if (objArr.length > 0) {
          for (let i = 0; i < objArr.length; i++) {
            getID(objArr[i], a);
          }
        }
      }
    }
  }
  return a;
};

// function to check the number of instances
export const checkInstanceCount = (fileOne, fileTwo) => {
  let countA, countB;
  const countInstance = (jS: Widget) => {
    const allWIdgets = jS.getAllWithKey("INSTANCE", "type");
    // console.log(allWIdgets);
    return allWIdgets.length;
  };
  countA = countInstance(fileOne);
  countB = countInstance(fileTwo);
  // console.log("countA", countA);
  // console.log("countB", countB);
  return countA === countB;
};

// function to check the ID and parent IDs
export const checkParentID = (fileOne, fileTwo) => {
  let arrA: string[] = [];
  let arrB: string[] = [];
  let arr: string[] = [];
  arrA = getID(fileOne, arr);
  arr = [];
  arrB = getID(fileTwo, arr);

  let incorrect: string[] = [];
  let count = 0;
  let nodeA, nodeB, nodeBID;
  let pcA: Widget[] = [];
  let pcB: Widget[] = [];
  for (let i = 0; i < arrB.length; i++) {
    if (arrA.includes(arrB[i])) {
      nodeA = fileOne.traverseTillProp(arrB[i], "id");
      nodeB = fileTwo.traverseTillProp(arrB[i], "id");
      if (nodeA.processedChildren) {
        pcA = nodeA.processedChildren;
        if (pcA.length > 0) {
          pcB = nodeB.processedChildren;
          for (let i = 0; i < pcB.length; i++) {
            if (pcB[i].parentNodeId !== nodeB.id) {
              incorrect.push(nodeB.name);
              count++;
            }
          }
        }
      }
    }
  }

  if (count > 0) {
    console.log("Incorrect parent node ID: ", incorrect);
    return false;
  } else {
    return true;
  }
};

// function to check the type of node
export const checkNodeType = (fileOne, fileTwo) => {
  let arrA: string[] = [];
  let arrB: string[] = [];
  let arr: string[] = [];

  arrA = getID(fileOne, arr);
  arr = [];
  arrB = getID(fileTwo, arr);
  let nodeA, nodeB, typeA, typeB;
  let countA = 0;
  let countB = 0;
  let count = 0;
  let incorrect: string[] = [];
  for (let i = 0; i < arrB.length; i++) {
    if (arrA.includes(arrB[i])) {
      // console.log("A: ", arrA[i]);
      countA++;
      nodeA = fileOne.traverseTillProp(arrB[i], "id");
      typeA = nodeA.type;

      // console.log("B: ", arrB[i]);
      countB++;
      nodeB = fileTwo.traverseTillProp(arrB[i], "id");
      typeB = nodeB.type;

      if (typeA !== typeB) {
        incorrect.push(nodeA.name);
        count++;
      }
    }
  }

  // console.log("A: ", countA);
  // console.log("B: ", countB);

  if (count > 0) {
    console.log("Nodes with type mismatch: ", incorrect);
    return false;
  } else {
    return true;
  }
};

// function to check node of type TEXT has fontObject property
export const checkHasFontObject = (fileTwo) => {
  let textType: Widget[];
  let incorrect: string[];
  let count = 0;
  textType = fileTwo.getAllWithKey("TEXT", "type");
  for (let node of textType) {
    if (node.fontObject === null) {
      incorrect.push(node.name);
      count++;
    }
  }
  if (count > 0) {
    console.log(
      "Nodes of type text that don't have fontObject property: ",
      incorrect
    );
    return false;
  } else {
    return true;
  }
};

// function to check the category of node
// do not check for list of items, cards abd chips
export const checkCategory = (fileOne, fileTwo) => {
  let arrA: string[] = [];
  let arrB: string[] = [];
  let arr: string[] = [];

  arrA = getID(fileOne, arr);
  arr = [];
  arrB = getID(fileTwo, arr);

  let nodeA, nodeB, catA, catB;
  let count = 0;
  let incorrect: string[] = [];
  for (let i = 0; i < arrB.length; i++) {
    if (arrA.includes(arrB[i])) {
      nodeA = fileOne.traverseTillProp(arrB[i], "id");
      catA = nodeA.category;
      nodeB = fileTwo.traverseTillProp(arrB[i], "id");
      catB = nodeB.category;

      if (catA !== catB) {
        if ((catA === "group" || catA === "container") && catB === "frame") {
          continue;
        }
        incorrect.push(nodeB.name);
        count++;
      }
    }
  }

  if (count > 0) {
    console.log("Nodes with category mismatch: ", incorrect);
    return false;
  } else {
    return true;
  }
};

// function to check the order of nodes: unfinished
export const checkOrderOfNodes = (fileOne, fileTwo) => {
  let arrA: string[] = [];
  let arrB: string[] = [];
  let arr: string[] = [];

  arrA = getID(fileOne, arr);
  arr = [];
  arrB = getID(fileTwo, arr);

  let nodeA, nodeB, layoutModeA, layoutModeB, y, x;
  let pcB: Widget[] = [];
  let Y: number[] = [];
  let X: number[] = [];
  for (let i = 0; i < arrB.length; i++) {
    if (arrA.includes(arrB[i])) {
      nodeA = fileOne.traverseTillProp(arrB[i], "id");
      nodeB = fileTwo.traverseTillProp(arrB[i], "id");
      if (nodeA.processedChildren && nodeB.processedChildren) {
        console.log("A IA: ", nodeA.inferredAutoLayout);
        layoutModeA = nodeA.inferredAutoLayout.layoutMode;
        layoutModeB = nodeB.inferredAutoLayout.layoutMode;
        pcB = nodeB.processedChildren;
        if (layoutModeA === layoutModeB) {
          if (layoutModeB === "VERTICAL") {
            for (let i = 0; i < pcB.length; i++) {
              y = pcB[i].y;
              Y.push(y);
              console.log("Y: ", Y);
            }
          } else if (layoutModeB === "HORIZONTAL") {
            for (let i = 0; i < pcB.length; i++) {
              x = pcB[i].x;
              X.push(x);
              console.log("X: ", X);
            }
          }
        }
      }
    }
  }
};
// function to check nodes with processChildren have inferredAutoLayoutML property in JSON B
export const checkHasIALML = (fileOne, fileTwo) => {
  let arrA: string[] = [];
  let arrB: string[] = [];
  let arr: string[] = [];

  arrA = getID(fileOne, arr);
  arr = [];
  arrB = getID(fileTwo, arr);

  let nodeA: Widget, nodeB: Widget, pcA, ialml, PB, PL, PR, PT;
  let incorrectSpacing: string[] = [];
  let incorrectPadding: string[] = [];
  for (let i = 0; i < arrB.length; i++) {
    if (arrA.includes(arrB[i])) {
      nodeA = fileOne.traverseTillProp(arrB[i], "id");
      pcA = nodeA.processedChildren;

      if (pcA.length > 0 || pcA !== null) {
        nodeB = fileTwo.traverseTillProp(arrB[i], "id");
        if (nodeB.processedChildren) {
          if (nodeB.inferredAutoLayoutML) {
            ialml = nodeB.inferredAutoLayoutML.spacing;
            if (ialml === "Negative spacing value, NEEDS REVIEW!") {
              incorrectSpacing.push(nodeB.name);
            }
            PB = nodeB.inferredAutoLayoutML.paddingBottom;
            PL = nodeB.inferredAutoLayoutML.paddingLeft;
            PR = nodeB.inferredAutoLayoutML.paddingRight;
            PT = nodeB.inferredAutoLayoutML.paddingTop;
            if (!(PB >= 0 && PL >= 0 && PR >= 0 && PT >= 0)) {
              incorrectPadding.push(nodeB.name);
            }
          }
        }
      }
    }
  }

  if (incorrectSpacing.length > 0 || incorrectPadding.length > 0) {
    console.log("Nodes with mismatch:");
    console.log("Spacing: ", incorrectSpacing);
    console.log("Padding: ", incorrectPadding);
    return false;
  } else {
    return true;
  }
};

// function to check grouping / firstChild: unfinished
export const checkGrouping = (file) => {
  let arrB: string[] = [];
  let arr: string[] = [];
  arrB = getID(file, arr);
  // console.log(arrB);

  let node, key;

  let pcArr = [];
  let pcName = [];
  let pcNameObj = {};
  let checkGroup = {
    "203:701": ["Frame 14797", "Frame 12556"],
    "203:702": ["Primary Header", "Frame 14796"],
    "203:703": ["Global Nav / Primary Header / FIS Logo", "Group 2342"],
    "I203:703;589:1121": [
      "Group 211",
      "Path 156",
      "Path 155",
      "Path 154",
      "Path 153",
      "Path 152",
      "Path 159",
      "Path 151",
    ],
    "I203:703;589:1121;245:446": ["Path 157", "Path 158"],
    "I203:703;589:1308": [
      "Global Nav / Primary Header / Logout",
      "Global Nav / Primary Header / Seperator",
      "Global Nav / Primary Header / FIS Logo / Icon_Notification",
      "Global Nav / Primary Header / Icon_Search",
    ],
    "I203:703;589:1118": [""],
    "I203:703;589:1117": [""],
    "I203:703;589:1120": ["Button"],
    "203:704": ["Side Navigation", "Frame 14795"],
    "203:705": ["Header", "Group 14678", "Frame 14769"],
    "I203:705;2910:137131": [
      "Expand",
      "Global Nav / Primary Header / FIS Logo",
      "Plan Onboarding",
      "789564123",
      "Sidebar Main Nav",
      "Sidebar Main Nav",
      "Sidebar Main Nav",
    ],
    "I203:705;2910:137139": [
      "1",
      "Rectangle 10539",
      "Your plan onboarding is 15% completed.",
      "Rectangle 10540",
    ],
    "I203:705;3688:279606": [
      "Collapsed Nav Milestone",
      "Collapsed Nav Milestone",
      "Collapsed Nav Milestone",
      "Collapsed Nav Milestone",
      "Collapsed Nav Milestone",
      "Collapsed Nav Milestone",
      "Collapsed Nav Milestone",
    ],
    "I203:705;2910:137133": ["Expand", "Group 14488"],
    "I203:705;2910:137132": [
      "Path 159",
      "Group 211",
      "Path 156",
      "Path 155",
      "Path 154",
      "Path 153",
      "Path 152",
      "Path 151",
    ],
    "I203:705;2966:228895": [
      "sidebar main nav icons",
      "Home",
      "Rectangle 10547",
    ],
    "I203:705;2966:228896": [
      "sidebar main nav icons",
      "Contacts",
      "Group 14687",
    ],
    "I203:705;2966:228897": [
      "sidebar main nav icons",
      "Contacts",
      "Group 14687",
    ],
    "I203:705;3688:279607": ["Frame 14767"],
    "I203:705;3688:279608": ["Frame 14767"],
    "I203:705;3688:279609": ["Frame 14767"],
    "I203:705;3688:279610": ["Frame 14768"],
    "I203:705;3688:279611": ["Frame 14767"],
    "I203:705;3688:279613": ["Frame 14767"],
    "I203:705;3688:279614": ["Frame 14768"],
    "I203:705;2910:137134": ["", ""],
    "I203:705;2910:137132;245:389": ["Path 158", "Path 157"],
    "I203:705;2966:228895;3703:238312": [""],
    "I203:705;2966:228896;2966:219877": ["Rectangle 10548", "Rectangle 10547"],
    "I203:705;2966:228896;2966:226620": [""],
    "I203:705;2966:228897;2966:219877": ["Rectangle 10548", "Rectangle 10547"],
    "I203:705;3688:279607;3670:252572": ["Plan Setup", "UI Milestone Icons"],
    "I203:705;3688:279608;3670:252572": ["Plan Setup", "UI Milestone Icons"],
    "I203:705;3688:279609;3670:252572": ["Plan Setup", "UI Milestone Icons"],
    "I203:705;3688:279611;3678:263574": ["Plan Setup", "UI Milestone Icons"],
    "I203:705;3688:279613;3670:252572": ["Plan Setup", "UI Milestone Icons"],
    "I203:705;3688:279614;3670:263468": [
      "Plan Established in Record Keeping System",
    ],
    "I203:705;3688:279610;3670:263468": [
      "Plan Established in Record Keeping System",
    ],
    "I203:705;2966:228897;2966:226620": [""],
    "I203:705;3688:279607;3666:227836": [""],
    "I203:705;3688:279608;3666:227836": [""],
    "I203:705;3688:279609;3666:227836": [""],
    "I203:705;3688:279613;3666:227836": [""],
    "203:706": ["Frame 12458", "Frame 14688", "Frame 12555"],
    "203:707": ["Back", "Line 18", "Breadcrumbs"],
    "203:708": [""],
    "203:710": ["Frame 12319"],
    "203:711": ["Breadcrumbs", "Breadcrumbs"],
    "203:712": ["Page Name", "/"],
    "203:713": ["Page Name"],
    "203:714": [
      "Initial Setup",
      "Please provide the details below for initial setup to allow of the ability to perform Participant and Payroll Setups.",
    ],
    "203:717": ["Frame 12469", "Frame 14397"],
    "203:718": ["Search panel", "Table", "NAMEXD", "Table"],
    "203:719": [
      "Frame 14761",
      "All updates to this screen can be saved at any time. Once the plan has been established in the record keeping system and all information on this screen has been completed, the submit button will be activated to allow you to submit this information for the initial setup.",
      "Frame 14762",
    ],
    "203:720": ["Info"],
    "203:721": ["Info"],
    "I203:721;696:950": [""],
    "203:724": ["Frame 12831", "Frame 12920"],
    "203:725": ["Frame 12656"],
    "203:726": ["Title"],
    "203:727": ["Frame 12822"],
    "203:728": ["Payroll Work Order Rules"],
    "203:730": ["Section one"],
    "203:731": ["content"],
    "203:732": ["Row 1", "Row 3"],
    "203:733": ["Frame 12332", "Frame 12330", "Frame 12334", "Frame 12335"],
    "203:734": ["Days Prior", "7"],
    "203:737": ["Funding Days Prior", "7"],
    "203:740": ["Print Invoices", "Yes"],
    "203:743": ["Allow Negatives", "No"],
    "203:746": ["Frame 12332", "Frame 12336", "Frame 12337", "Frame 12338"],
    "203:747": ["Store Light Values", "Yes"],
    "203:750": ["Sources", "Pending completion of Plan Setup milestone"],
    "203:753": [
      "Are Participant loans allowed in the plan?",
      "Pending completion of Plan Setup milestone",
    ],
    "203:756": [
      "Will Plan provide Eligibility/Plan Entry or will Omni calculate?",
      "Pending completion of Plan Setup milestone",
    ],
    "203:759": ["Button"],
    "203:760": ["Frame 12831", "Frame 12920"],
    "203:761": ["Frame 12656"],
    "203:762": ["Title", "Minus"],
    "203:763": ["Frame 12822"],
    "203:764": [
      "Frame 14768",
      "Please provide the details below for initial setup to allow of the ability to perform Participant and Payroll Setups.",
    ],
    "203:765": ["Setup 1/1", "Client Work Order Setup Information"],
    "203:769": [""],
    "203:770": ["Section one"],
    "203:771": ["content"],
    "203:772": ["Frame 14696", "Frame 14773", "Frame 14772"],
    "203:773": ["Frame 14780", "Frame 14695"],
    "203:774": ["Work Order Details"],
    "203:776": ["Frame 14688", "Frame 14769"],
    "203:777": ["Input Box"],
    "203:778": ["Label", "Frame 3", "Helper/Error text"],
    "I203:778;240:343": ["Placeholder/Input text"],
    "203:779": ["Input Box", "Input Box"],
    "203:780": ["Label", "Frame 3"],
    "I203:780;240:223": ["Placeholder/Input text", "Down_Chevron"],
    "I203:780;465:501": [""],
    "203:781": ["Label", "Frame 3"],
    "I203:781;240:223": ["Placeholder/Input text", "Down_Chevron"],
    "I203:781;465:501": [""],
    "203:782": ["Frame 14771", "Frame 14782"],
    "203:783": [
      "Frame 14781",
      "This allows for the scheduling of recurring work orders. Please note that 'No' is the default. Select 'Yes' from the drop down, if necessary, to update",
    ],
    "203:784": ["Payroll Scheduling"],
    "203:787": ["Frame 12461", "Group 14689", "Group 14690"],
    "203:788": ["Frame 14774", "Frame 12460"],
    "203:789": ["Scheduling"],
    "203:791": ["Radio Button Full", "Radio Button Full"],
    "203:792": ["Radiobutton", "Checkbox Full"],
    "I203:792;446:410": ["Radio"],
    "I203:792;446:410;446:394": ["Ellipse 600", "Ellipse 599"],
    "I203:792;446:405": ["Radiobutton label"],
    "203:793": ["Radiobutton", "Checkbox Full"],
    "I203:793;446:410": ["Radio"],
    "I203:793;446:410;24:202": ["Ellipse 600", "Ellipse 599", "Ellipse 518"],
    "I203:793;446:405": ["Radiobutton label"],
    "203:794": ["Frame 12648", "Frame 12332"],
    "203:797": ["Frame 12648"],
    "203:798": ["Input Box", "Input Box", "Input Box"],
    "203:799": ["Label", "Frame 3"],
    "I203:799;240:223": ["Placeholder/Input text", "Calender"],
    "I203:799;465:501": [""],
    "203:800": ["Label", "Frame 3"],
    "I203:800;240:223": ["Placeholder/Input text", "Calender"],
    "I203:800;465:501": [""],
    "203:801": ["Label", "Frame 3"],
    "I203:801;240:223": ["Placeholder/Input text", "Calender"],
    "I203:801;465:501": [""],
    "203:795": ["First Payroll Dates"],
    "203:802": ["Frame 12648", "Frame 12332"],
    "203:805": ["Frame 12648"],
    "203:806": ["Frame 12648"],
    "203:807": ["Input Box", "Input Box", "Input Box"],
    "203:808": ["Label", "Frame 3"],
    "I203:808;240:223": ["Placeholder/Input text", "Calender"],
    "I203:808;486:1042": [""],
    "I203:808;465:501": [""],
    "203:809": ["Label", "Frame 3"],
    "I203:809;240:223": ["Placeholder/Input text", "Calender"],
    "I203:809;486:1042": [""],
    "I203:809;465:501": [""],
    "203:810": ["Label", "Frame 3"],
    "I203:810;240:223": ["Placeholder/Input text", "Calender"],
    "I203:810;486:1042": [""],
    "I203:810;465:501": [""],
    "203:803": ["Subsequent Payroll Dates"],
    "203:811": ["Frame 14783", "Frame 14783"],
    "203:812": [
      "Frame 14781",
      "'Yes' is the default. Select No from the drop down, if necessary, to update",
    ],
    "203:813": ["Payroll Funding"],
    "203:816": ["Input Box", "Frame 14690"],
    "203:817": ["Label", "Frame 3"],
    "I203:817;240:223": ["Placeholder/Input text", "Down_Chevron"],
    "I203:817;465:501": [""],
    "203:818": ["Frame 14689", "Frame 14690"],
    "203:819": ["Approve Funding", "Frame 12460"],
    "203:821": ["Radio Button Full", "Radio Button Full"],
    "203:822": ["Radiobutton", "Checkbox Full"],
    "I203:822;446:410": ["Radio"],
    "I203:822;446:410;24:20": ["Ellipse 600", "Ellipse 599", "Ellipse 518"],
    "I203:822;446:405": ["Radiobutton label"],
    "203:823": ["Radiobutton", "Checkbox Full"],
    "I203:823;446:410": ["Radio"],
    "I203:823;446:410;446:394": ["Ellipse 600", "Ellipse 599"],
    "I203:823;446:405": ["Radiobutton label"],
    "203:824": ["Allow Forfeitures", "Frame 12460"],
    "203:826": ["Radio Button Full", "Radio Button Full"],
    "203:827": ["Radiobutton", "Checkbox Full"],
    "I203:827;446:410": ["Radio"],
    "I203:827;446:410;24:202": ["Ellipse 600", "Ellipse 599", "Ellipse 518"],
    "I203:827;446:405": ["Radiobutton label"],
    "203:828": ["Radiobutton", "Checkbox Full"],
    "I203:828;446:410": ["Radio"],
    "I203:828;446:410;446:394": ["Ellipse 600", "Ellipse 599"],
    "I203:828;446:405": ["Radiobutton label"],
    "203:829": ["Frame 12594", "Group 14694"],
    "203:830": ["Secondary Button"],
    "203:831": ["Button"],
    "203:832": ["Frame 14492", "Text Button"],
    "203:834": ["Primary Button"],
    "203:835": ["Button"],
    "203:833": ["Button"],
    "203:836": ["Footer Desktop"],
    "203:837": [
      "FIS logo white",
      "Top line",
      "Resources",
      "Legal Disclaimer",
      "Get in touch",
      "Donec vitae mi vulputate, suscipit urna in, malesuada nisl. Pellentesque laoreet pretium nisl, et pulvinar massa eleifend sed. Curabitur maximus mollis diam, vel varius sapien suscipit eget. Cras sollicitudin ligula at volutpat ultrices. Nunc arcu enim, rhoncus eu maximus id, malesuada eu neque. Nunc aliquet cursus tortor id pellentesque. Quisque tempus arcu sed felis tempus, vel rutrum diam egestas.",
      "BG",
    ],
    "I203:837;526:757": [
      "Path 159",
      "Group 211",
      "Path 156",
      "Path 155",
      "Path 154",
      "Path 153",
      "Path 152",
      "Path 151",
    ],
    "I203:837;526:757;245:446": ["Path 158", "Path 157"],
    "I203:837;526:748": ["Title", "Links"],
    "I203:837;526:749": ["Resources"],
    "I203:837;526:751": [
      "Help and Support Center",
      "Technical Support",
      "Accessibility",
      "Sitemap",
    ],
    "I203:837;526:740": ["Title", "Links"],
    "I203:837;526:741": ["Legal Disclaimers"],
    "I203:837;526:743": [
      "Website Privacy Statement",
      "Terms & Conditions of Use",
      "Business Continuity Plan",
      "Security Measures",
    ],
    "I203:837;526:715": ["Title", "Links", "Frame 12"],
    "I203:837;526:716": ["Get in Touch"],
    "I203:837;526:718": ["Help & Support Center", "Technical Support"],
    "I203:837;526:721": ["Combined Shape", "Twitter", "Facebook"],
    "I203:837;526:722": ["Shape", "Oval"],
    "I203:837;526:726": ["Path", "Path", "Path"],
    "I203:837;526:723": ["Path", "Path"],
    "I203:837;526:730": ["Path", "Oval"],
    "I203:837;526:731": ["Path", "Path"],
    "I203:837;526:735": ["Path", "Oval"],
    "I203:837;526:736": ["Path", "Path"],
  };

  for (let i = 0; i < arrB.length; i++) {
    node = file.traverseTillProp(arrB[i], "id");
    if (node.processedChildren) {
      pcArr = node.processedChildren;
      if (pcArr.length > 0) {
        for (let i = 0; i < pcArr.length; i++) {
          let nodeName = pcArr[i].name;
          pcName.push(nodeName);
        }
        key = arrB[i];
        pcNameObj[key] = pcName;
        pcName = [];
      }
    }
  }
  // console.log(pcNameObj);
  // console.log("pcNameObj: ", Object.keys(pcNameObj).length);
  // console.log("checkGroup: ", Object.keys(checkGroup).length);
  let len = Object.keys(checkGroup).length;
  let pcn = Object.keys(pcNameObj);
  let cg = Object.keys(checkGroup);
  let arrae = [];
  for (let i = 0; i < len; i++) {
    if (!pcn.includes(cg[i])) {
      arrae.push(cg[i]);
    }
  }
  console.log("not in pcn: ", arrae);
};
// if has processed children should contain inferredAutoLayoutML.

// if inferredAutoLayoutML exists, then inside, spacing has to be a positive number.
// same for padding

// function to check getAll
export const checkButtonInstance = (fileTwo) => {
  let arr = fileTwo.getAll((node) => node.name === "Button");
  let count = 0;
  let ic = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type !== "INSTANCE") {
      ic.push(arr[i].id);
      count++;
    }
  }
  if (count > 0) {
    console.log(ic);
    return false;
  } else {
    return true;
  }
};
