const glob = require("glob");

module.exports = {
  plugins: [
    require("cssnano")({
      preset: "default",
    }),
    require("autoprefixer")(),
  ],
};
