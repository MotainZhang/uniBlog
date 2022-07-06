/**
 * 自定义公共函数包
 * 这里可以写你自己的公共函数
 */
var pubFun = {};
var vk; // 全局vk实例
/**
 * 初始化，请勿删除此代码
 */
pubFun.init = function(util) {
	vk = util.vk;// 也可以通过 uniCloud.vk 获取 vk对象
}
/**
 * 公共函数写法示例
 * pubFun.test();
 */
pubFun.test = function(path) {
	// 逻辑
	// ...
	// 逻辑	
	return "这是公共函数test的返回";
}


module.exports = pubFun;
