// const fs = require("fs");
import * as fs from "fs";
import Widget from "./Widget";
import JSZip from "jszip";
import {processSetUp} from "./processSetUp";

// const { default: Widget } = require("./Widget");
// const JSZip = require("jszip");
// const buffer = new Buffer.alloc(6000000);

export const processJSON = async (file, isJsonB) => {
	const data = fs.readFileSync(file, "utf8");
	// console.log("data: ", data);
	const js = JSON.parse(data);
	const page = new Widget(js);
	// console.log("page: ", page.processedChildren);
	processSetUp(page);
	// console.log("processSetUp: ", page.children);
	await page.processTree(
		isJsonB,
		JSZip,
		page.absoluteBoundingBox.x,
		page.absoluteBoundingBox.y
	);
	return page;

	//   console.log(data);
	//   await fs.open(file, "r+", async function (err, fd) {
	//     if (err) {
	//       return console.error(err);
	//     }
	//     // console.log("Reading the mentioned file.");
	//     await fs.read(fd, buffer, 0, buffer.length, 0, async function (err, bytes) {
	//       if (err) {
	//         console.error(err);
	//       }

	//       if (bytes > 0) {
	//         const data = JSON.parse(buffer.slice(0, bytes).toString());
	//         console.log(data);
	//         page = new Widget(data);
	//         processSetUp(page);
	//         await page.processTree(
	//           false,
	//           JSZip,
	//           page.absoluteBoundingBox.x,
	//           page.absoluteBoundingBox.y
	//         );
	//         // page.processTree(false, JSZip, page.absoluteBoundingBox.x, page.absoluteBoundingBox.y)
	//       }
	//       fs.close(fd, function (err) {
	//         if (err) {
	//           console.error(err);
	//         }
	//         // console.log("File closed successfully");
	//       });
	//     });
	//   });
};
