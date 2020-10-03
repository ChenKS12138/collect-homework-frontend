import { projectListData } from "./mockData";
export default [
  {
    url: "/project/",
    method: "get",
    response() {
      return {
        success: true,
        data: {
          projects: projectListData,
        },
      };
    },
  },
  {
    url: "/project/own",
    method: "get",
    response() {
      return {
        success: true,
        data: {
          projects: projectListData,
        },
      };
    },
  },
  {
    url: "/project/insert",
    method: "get",
    response() {
      return {
        success: true,
        data: true,
      };
    },
  },
  {
    url: "/project/update",
    method: "get",
    response() {
      return {
        success: true,
        data: true,
      };
    },
  },
];
