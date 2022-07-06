const requireFn = function(path) {
  return require(path);
}
const initConfig = {
  baseDir: __dirname, // 云函数根目录地址
  requireFn,
  customUtil :{
    // 你自己的工具包，写这里后即可听过customUtil.mynpm1调用
  	// mynpm1:mynpm1
  }
};
module.exports = initConfig;