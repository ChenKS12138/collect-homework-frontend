import { projectListData } from "./mockData";
export default [
  {
    url: "/project/list",
    method: "get",
    response() {
      return {
        projects: projectListData,
      };
    },
  },
  {
    url: "/project/own",
    method: "get",
    response() {
      return {
        projects: projectListData,
      };
    },
  },
];
