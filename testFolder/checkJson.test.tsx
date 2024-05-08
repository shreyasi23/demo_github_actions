import {processJSON} from "../index";
import {
	checkInstanceCount,
	checkParentID,
	checkNodeType,
	checkHasFontObject,
	checkHasIALML,
	checkCategory,
	checkOrderOfNodes,
	checkGrouping,
	checkButtonInstance,
} from "../src/checkFunctions";

// Verify that the number of instances in both JSON A and JSON B is same
test("Verify that the number of instances in both JSON A and JSON B is same", async () => {
	const jsonA = await processJSON("./jsonFiles/page4A.json", false);
	console.log("jsonA loaded successfully");
	const jsonB = await processJSON("./jsonFiles/page4B.json", true);
	console.log("jsonB loaded successfully");

	// const jsonB = processJSON("./FISPAge1B.json")
	const res = checkInstanceCount(jsonA, jsonB);
	expect(res).toBe(true);
});

// Verify ID and parent ID
test("Verify the node ID and parent ID in JSON B", async () => {
	const jsonA = await processJSON("./jsonFiles/page4A.json", false);
	console.log("jsonA loaded successfully");
	const jsonB = await processJSON("./jsonFiles/page4B.json", true);
	console.log("jsonB loaded successfully");
	let res = checkParentID(jsonA, jsonB);
	expect(res).toBe(true);
});

// Verify the type of node
test("Verify the type of node", async () => {
	const jsonA = await processJSON("./jsonFiles/page4A.json", false);
	console.log("jsonA loaded successfully");
	const jsonB = await processJSON("./jsonFiles/page4B.json", true);
	console.log("jsonB loaded successfully");
	let res = checkNodeType(jsonA, jsonB);
	expect(res).toBe(true);
});

// Verify if node of type TEXT has fontObject property
test("Verify if node of type TEXT has fontObject property", async () => {
	const jsonB = await processJSON("./jsonFiles/page4B.json", false);
	console.log("jsonB loaded successfully");
	let res = checkHasFontObject(jsonB);
	expect(res).toBe(true);
});

// Verify if processedChildren property exists for node in JSON B and if it has inferredAutoLayoutML as a property and value of spacing and padding is either 0 or a positive value
test("Verify if processedChildren property exists for node in JSON B and if it has inferredAutoLayoutML as a property and value of spacing and padding is either 0 or a positive value", async () => {
	const jsonA = await processJSON("./jsonFiles/page4A.json", false);
	console.log("jsonA loaded successfully");
	const jsonB = await processJSON("./jsonFiles/page4B.json", true);
	console.log("jsonB loaded successfully");
	let res = checkHasIALML(jsonA, jsonB);
	expect(res).toBe(true);
});

// Verify the category of node
test("Verify if category of node is same in both JOSN A and JSON B", async () => {
	const jsonA = await processJSON("./jsonFiles/page4A.json", false);
	console.log("jsonA loaded successfully");
	const jsonB = await processJSON("./jsonFiles/page4B.json", true);
	console.log("jsonB loaded successfully");
	let res = checkCategory(jsonA, jsonB);
	expect(res).toBe(true);
});

// Verify the order of nodes in JSON B
// test("Verify the order of nodes in JSON B", async () => {
//   const jsonA = await processJSON("./jsonFiles/FISPAge1A.json", false);
//   console.log("jsonA loaded successfully");
//   const jsonB = await processJSON("./jsonFiles/FISPAge1B.json", true);
//   console.log("jsonB loaded successfully");
//   checkOrderOfNodes(jsonA, jsonB);
// });

//Verify the grouping of nodes in JSON B
// test("Verify the grouping of nodes in JSON B", async () => {
//   const jsonB = await processJSON("./jsonFiles/FISPAge1B.json", true);
//   console.log("json loaded successfully");
//   checkGrouping(jsonB);
// });

// test.only("test to verify getAll fucntion", async () => {
//   const jsonB = await processJSON("./jsonFiles/FISPAge1B.json", false);
//   console.log("jsonB loaded successfully");
//   let res = checkButtonInstance(jsonB);
//   expect(res).toBe(true);
// });
