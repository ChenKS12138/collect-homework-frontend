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
];
