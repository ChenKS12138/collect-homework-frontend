import { fileData } from "mock/mockData";

export default [
  // {
  //   url: /files\/(-|[A-Z]|\d)+/,
  //   method: "get",
  //   response() {
  //     return {
  //       success: true,
  //       data: {
  //         files: fileData,
  //       },
  //     };
  //   },
  // },
  {
    url: "storage/fileList",
    method: "get",
    response() {
      return {
        success: true,
        data: {
          files: fileData,
        },
      };
    },
  },
  {
    url: "/storage/fileCount",
    method: "get",
    response() {
      return {
        success: true,
        data: {
          count: 12,
        },
      };
    },
  },
];
