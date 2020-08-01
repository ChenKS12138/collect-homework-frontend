import { fileData } from "mock/mockData";

export default [
  {
    url: /files\/(-|[A-Z]|\d)+/,
    method: "get",
    response() {
      return {
        files: fileData,
      };
    },
  },
];
