/**
 * 导出云对象实例
 * @param {String} name 云对象路径，如：client/pub 
 * @example const pubObject = uni.vk.importObject('client/pub'); // 导入云对象
 * 注意，只能在声明 async 的函数内使用，如：
async test(){
	let res = await pubObject.getList({
		title: "请求中",
		data: { 
			a: 1,
			b: "2"
		}
	});
}
 */
var importObject = function(name) {
	const newObj = new Proxy(importObject, {
		get: function(target, key, receiver) {
			/**
			 * 导出云对象内的某个方法
			 * @param {Object}   data      请求参数，如 { a:1, b:"2" } 云对象内可通过 let { a, b } = data; 获取参数
			 * @param {String}   title     遮罩层提示语，为空或不传则代表不显示遮罩层。
			 * @param {Boolean}  needAlert 为true代表请求错误时，会有弹窗提示。默认为true
			 * @param {Object}   loading   与title二选一，格式为 { name: "loading", that: that }  name是变量名，that是数据源，当发起请求时，自动that[name] = true; 请求结束后，自动that[name] = false;
			 */
			return async function(options) {
				return uni.vk.callFunction({
					...options,
					url: `${name}.${key}`
				});
			}
		},
		// set: function(target, key, value, receiver) {
		// 	console.log("set");
		// 	console.log("target",target);
		// 	console.log("key",key);
		// 	console.log("value",value);
		// 	console.log("receiver", receiver);
		// },
	});
	return newObj;
};

export default importObject;
