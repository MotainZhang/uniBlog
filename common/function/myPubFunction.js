/**
 * 自定义公共函数
 */
var myfn = {};
/**
 * 测试函数test1
 * vk.myfn.test1();
 */
myfn.test1 = function(obj = {}) {
	let vk = uni.vk;
	console.log("执行了自定义公共函数test1");
	return obj;
};

export default myfn;
