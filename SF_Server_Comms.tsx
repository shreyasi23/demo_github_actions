import systemSetter from "./selectedSystem";

export const getGroupingImagesAndID = async (node: string) => {
  const response = await fetch(
    "https://apps.wavemakeronline.com/autocode/design_analysis",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{"figma_data": ${node},"design_type": "${systemSetter.currentSystem}"}`,
    }
  );
  const imagesResp: {
    data: {
      "Final Layout_Grouping": string;
      "Final Similarity_Grouping": string;
      ID: number;
    };
    status_code: number;
  } = await response.json();
  // console.log(imagesResp.data);
  return imagesResp.data.ID;
};

export const requestJsonB = async (id: number) => {
  const response = await fetch(
    "https://apps.wavemakeronline.com/autocode/tree",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{"ID": ${id}}`,
    }
  );
  const jsonBResp: {
    data: Object & { processedChildren: []; parent: string };
  } = await response.json();
  return jsonBResp.data;
};
