eval(
  require("typescript")
  .transpile(
    require("fs")
    .readFileSync("./build-tools/gulpfile.ts")
    .toString()
  )
);
