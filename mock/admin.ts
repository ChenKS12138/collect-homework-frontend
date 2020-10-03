export default [
  {
    url: "/admin/status",
    method: "get",
    response() {
      return {
        success: true,
        data: {
          projectCount: 123,
          fileCount: 456,
          totalSize: 789,
        },
      };
    },
  },
  {
    url: "/admin/login",
    method: "post",
    response() {
      return {
        success: true,
        data: "FAKE_TOKEN",
      };
    },
  },
  {
    url: "/admin/invitationCode",
    method: "post",
    response() {
      return {
        success: true,
        data: true,
      };
    },
  },
  {
    url: "/admin/register",
    method: "post",
    response() {
      return {
        success: true,
        data: true,
      };
    },
  },
];
