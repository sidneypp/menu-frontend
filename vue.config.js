module.exports = {
  publicPath: "/",
  transpileDependencies: ["resize-detector"],
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    }
  }
};
