export default [
  {
    url: "/admin/basicInfo",
    method: "post",
    response() {
      return {
        projectsCount: 123,
        filesCount: 456,
        memoryUsed: 789,
      };
    },
  },
];
