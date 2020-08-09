export default [
  {
    url: "/auth/login",
    method: "post",
    response() {
      return {
        success: true,
      };
    },
  },
  {
    url: "/auth/secretCode",
    method: "post",
    response() {
      return {
        success: true,
      };
    },
  },
];
