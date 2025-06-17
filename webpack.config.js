const path = require("path");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: {
      path: path.resolve(__dirname, "dist"),
      filename: "my-first-webpack.bundle.js",
    },
  },
};
// 在上面的示例中，我们通过 output.filename 和 output.path 属性，来告诉 webpack bundle 的名称，以及我们想要 bundle 生成(emit)到哪里。可能你想要了解在代码最上面导入的 path 模块是什么，它是一个 Node.js 核心模块，用于操作文件路径。
