var requestUtil = {};


requestUtil.config = {
	// 请求配置
	request: {
		// 公共请求参数(每次请求都会带上的参数)
		dataParam: {}
	},
	requestGlobalParamKeyName: "vk_url_request_global_param",
	debug: process.env.NODE_ENV !== "production",
	// 日志风格
	logger: {
		colorArr: [
			"#0095ff",
			"#67C23A"
		]
	},
};
var counterNum = 0;
/**
 * request 请求库
 * 注意: 该请求库目前主要是框架自身使用，且近期变动频率较高，目前请勿使用在你自己的业务中。
 * @param {String} url                服务器接口地址
 * @param {Object/String/ArrayBuffer} data 请求的参数                                      App（自定义组件编译模式）不支持ArrayBuffer类型
 * @param {Object} header             设置请求的 header，header 中不能设置 Referer。         App、H5端会自动带上cookie，且H5端不可手动修改
 * @param {String} method             默认 POST 可选 GET
 * @param {Number} timeout            超时时间，单位 ms 默认3000(30秒)
 * @param {String} dataType           默认json 如果设为 json，会尝试对返回的数据做一次 JSON.parse
 * @param {String} responseType       默认 text 设置响应的数据类型。合法值：text、arraybuffer App和支付宝小程序不支持
 * @param {Boolean} sslVerify         默认 true 是否需要验证ssl证书 仅App安卓端支持（HBuilderX 2.3.3+）          仅App安卓端支持（HBuilderX 2.3.3+）
 * @param {Boolean} withCredentials   默认 false 跨域请求时是否携带凭证（cookies）            仅H5支持（HBuilderX 2.6.15+）
 * @param {Boolean} firstIpv4         默认 false DNS解析时优先使用ipv4                       仅 App-Android 支持 (HBuilderX 2.8.0+)
 * @param {String} success            成功回调
 * @param {String} fail               失败回调
 * @param {String} complete           完成回调
 * 以下为特殊参数
 * @param {String} errorCodeName      服务器返回的错误码的字段名，若不为空，则会对返回结果进行判断
 * @param {String} errorMsgName       服务器返回的错误码的字符串含义，若不为空，且errorCodeName对应的值不为0，则会alert弹窗
 * @param {Boolean} needAlert         服务器返回的错误时，是否需要alert弹出提示
 *
 * 调用示例
vk.request({
	url: `https://www.xxx.com/api/xxxx`,
	method:"POST",
	header:{
		"content-type": "application/x-www-form-urlencoded",
	},
	data:{
		
	},
	success: function(data){

	},
	fail: function(err){

	}
});
 */

requestUtil.request = function(obj = {}) {
	let vk = uni.vk;
	// 去除值为 undefined 的参数
	if(typeof obj.data === "object"){
		obj.data = vk.pubfn.copyObject(obj.data);
	}
	// 注入自定义全局参数开始-----------------------------------------------------------
	let config = requestUtil.config;
	let globalParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
	// 根据正则规格自动匹配全局请求参数
	for (let i in globalParam) {
		let customDate = globalParam[i];
		if (customDate.regExp) {
			if (typeof customDate.regExp === "object") {
				// 数组形式
				for (let i = 0; i < customDate.regExp.length; i++) {
					let regExp = new RegExp(customDate.regExp[i]);
					if (regExp.test(obj.url)) {
						obj.data = Object.assign(customDate.data, obj.data);
						break;
					}
				}
			} else {
				// 字符串形式
				let regExp = new RegExp(customDate.regExp);
				if (regExp.test(obj.url)) {
					obj.data = Object.assign(customDate.data, obj.data);
				}
			}
		}
	}
	// 根据指定globalParamName匹配全局请求参数
	let customDate = requestUtil.getRequestGlobalParam(obj.globalParamName);
	if (customDate && JSON.stringify(customDate) !== "{}") {
		if (customDate.regExp) {
			obj.data = Object.assign(customDate.data, obj.data); // 新版本
		} else {
			obj.data = Object.assign(customDate, obj.data); // 兼容旧版本
		}
	}
	// 注入自定义全局参数结束-----------------------------------------------------------

	if (!obj.method) obj.method = "POST"; // 默认POST请求
	if (typeof obj.dataType === "undefined") obj.dataType = "json";
	if (obj.dataType == "default" || obj.dataType === "") delete obj.dataType;
	if (typeof obj.header === "undefined" && typeof obj.headers !== "undefined") {
		obj.header = obj.headers;
	}
	if (typeof obj.timeout === "undefined") obj.timeout = 30000; // 超时时间，单位 ms(默认30秒)
	let Logger = {};
	if (config.debug) {
		Logger.params = (typeof obj.data == "object") ? vk.pubfn.copyObject(obj.data) : obj.data;
		Logger.startTime = new Date().getTime();
		let url = obj.url;
		let path = obj.url.split("?")[0];
		path = path.substring(path.indexOf("://") + 3);
		Logger.domainName = path.substring(0, path.indexOf("/"));
		Logger.action = path.substring(path.indexOf("/") + 1);
		Logger.url = url;
	}
	if (obj.title) vk.showLoading(obj.title);
	if (obj.loading) vk.setLoading(true, obj.loading);
	let promiseAction = new Promise(function(resolve, reject) {
		uni.request({
			...obj,
			success: function(res) {
				requestSuccess({
					res,
					params: obj,
					Logger,
					resolve,
					reject
				});
			},
			fail: function(res) {
				requestFail({
					res,
					params: obj,
					Logger,
					reject
				});
			},
			complete: function(res) {
				requestComplete({
					res,
					params: obj,
					Logger
				});
			}
		});
	});
	promiseAction.catch(error => {});
	return promiseAction;
}
// 请求成功回调
function requestSuccess(obj = {}) {
	let vk = uni.vk;
	let config = requestUtil.config;
	let {
		res = {},
			params,
			Logger,
			resolve,
			reject
	} = obj;
	let {
		title,
		needOriginalRes,
		dataType,
		errorCodeName,
		errorMsgName,
		success,
		loading
	} = params;
	let data = res.data || {};
	if (vk.pubfn.isNotNullAll(errorCodeName, data[errorCodeName])) {
		data.code = data[errorCodeName];
		delete data[errorCodeName];
	}
	if (vk.pubfn.isNotNullAll(errorMsgName, data[errorMsgName])) {
		data.msg = data[errorMsgName];
		if(typeof data[errorMsgName] === "string"){
			delete data[errorMsgName];
		}
	}
	if (config.debug) Logger.result = (typeof data == "object") ? vk.pubfn.copyObject(data) : data;
	if (res.statusCode >= 400 || data.code) {
		requestFail({
			res: data,
			params,
			Logger,
			reject
		});
	} else {
		if (title) vk.hideLoading();
		if (loading) vk.setLoading(false, loading);
		if (needOriginalRes) data.originalRes = vk.pubfn.copyObject(res);
		if (typeof success === "function") success(data);
		if (typeof resolve === "function") resolve(data);
	}
}

// 请求失败回调
function requestFail(obj = {}) {
	let vk = uni.vk;
	let config = requestUtil.config;
	let {
		res = {},
			params,
			Logger,
			reject
	} = obj;
	let {
		title,
		needAlert,
		fail,
		loading
	} = params;
	if (typeof needAlert === "undefined") {
		needAlert = (typeof fail === "function") ? false : true;
	}

	let errMsg = "";
	let sysErr = false;
	if (typeof res.code !== "undefined") {
		errMsg = res.msg;
	} else {
		sysErr = true;
		errMsg = JSON.stringify(res);
	}
	if (errMsg.indexOf("fail timeout") > -1) {
		sysErr = true;
		errMsg = "请求超时，请重试！";
	}
	if (config.debug) Logger.error = res;
	if (title) vk.hideLoading();
	if (loading) vk.setLoading(false, loading);
	let runKey = true;
	// 自定义拦截器开始-----------------------------------------------------------
	let { interceptor={} } = vk.callFunctionUtil.getConfig();
	if (interceptor.request && typeof interceptor.request.fail == "function") {
		runKey = interceptor.request.fail({
			vk,
			res: res,
			params: params
		});
		if (runKey === undefined) runKey = true;
	}
	// 自定义拦截器结束-----------------------------------------------------------
	if (runKey) {
		if (needAlert && vk.pubfn.isNotNull(errMsg)) {
			if (sysErr) {
				vk.toast("网络开小差了！", "none");
			} else {
				vk.alert(errMsg);
			}
		}
		if (typeof fail === "function") fail(res);
		if (typeof reject === "function") reject(res);
	}

}

// 请求完成回调
function requestComplete(obj = {}) {
	let vk = uni.vk;
	let config = requestUtil.config;
	let {
		res = {},
			params,
			Logger
	} = obj;
	let {
		title,
		needOriginalRes,
		complete
	} = params;
	if (config.debug) {
		Logger.endTime = new Date().getTime();
		Logger.runTime = (Logger.endTime - Logger.startTime);
		let colorArr = config.logger.colorArr;
		let colorStr = colorArr[counterNum % colorArr.length];
		counterNum++;
		console.log("%c--------【开始】【服务器请求】【" + Logger.action + "】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
		console.log("【请求地址】: ", Logger.url);
		console.log("【请求参数】: ", Logger.params);
		console.log("【返回数据】: ", Logger.result);
		console.log("【请求状态】: ", res.statusCode, "【http状态码】");
		console.log("【总体耗时】: ", Logger.runTime, "毫秒【含页面渲染】");
		console.log("【请求时间】: ", vk.pubfn.timeFormat(Logger.startTime, "yyyy-MM-dd hh:mm:ss"));
		if (Logger.error) {
			console.error("【Error】: ", Logger.error);
			if (Logger.error.err && Logger.error.err.stack) {
				console.error("【Stack】: ", Logger.error.err.stack);
			}
		}
		console.log("%c--------【结束】【服务器请求】【" + Logger.action + "】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
	}
	let data = res.data;
	if (needOriginalRes) data.originalRes = vk.pubfn.copyObject(res);
	if (typeof complete === "function") complete(data);
}

/**
 * 修改请求配置中的公共请求参数
 * 若把shop-manage改成*则代表全局
	vk.requestUtil.updateRequestGlobalParam({
		"shop-manage":{
			regExp:"^xxx/kh/",
			data:{
				shop_id : shop_id
			}
		}
	});
	对应的request中增加参数globalParamName:"shop-manage"
	vk.request({
		url: 'xxx/xxxxxx',
		title: '请求中...',
		globalParamName:"shop-manage",// 如果设置了正则规则,则不需要此参数
		data: {},
		success(data) {
		}
	});
 */
requestUtil.updateRequestGlobalParam = (data = {}, setKey) => {
	let vk = uni.vk;
	let config = requestUtil.config;
	if (setKey) {
		// 覆盖对象
		config.request.dataParam = data;
	} else {
		// 覆盖参数(有就覆盖,没有则新增)
		config.request.dataParam = Object.assign(config.request.dataParam, data);
	}
	vk.setStorageSync(config.requestGlobalParamKeyName, config.request.dataParam);
}

/**
 * 获取请求配置中的公共请求参数
	vk.requestUtil.getRequestGlobalParam();
 */
requestUtil.getRequestGlobalParam = (globalParamName = "*") => {
	let vk = uni.vk;
	let config = requestUtil.config;
	let data = config.request.dataParam;
	if (!data || JSON.stringify(data) === "{}") {
		data = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
		config.request.dataParam = data;
	}
	let param = data[globalParamName] || {};
	return JSON.parse(JSON.stringify(param));
}

/**
 * 删除请求配置中的公共请求参数
 * globalParamName 不传代表删除所有
	vk.requestUtil.deleteRequestGlobalParam(globalParamName);
 */
requestUtil.deleteRequestGlobalParam = (globalParamName) => {
	let vk = uni.vk;
	let config = requestUtil.config;
	let globalParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
	if (globalParamName) {
		delete globalParam[globalParamName];
	} else {
		globalParam = {};
	}
	config.request.dataParam = globalParam;
	vk.setStorageSync(config.requestGlobalParamKeyName, globalParam);
}

export default requestUtil;
