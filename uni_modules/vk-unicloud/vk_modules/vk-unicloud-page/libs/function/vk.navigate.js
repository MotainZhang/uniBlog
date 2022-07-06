/**
 * 函数 - 页面导航
 */
// #ifndef VUE3
var config;
try {
	config = require('@/app.config.js');
	if (typeof config.default === "object") {
		config = config.default;
	}
} catch (e) {
	config = {};
}
// #endif

// #ifdef VUE3
import config from '@/app.config.js'
// #endif


var util = {};

/**
 * 保留当前页面，跳转到应用内的某个页面，使用vk.navigateBack可以返回到原页面。
 * vk.navigateTo(url);
 */
util.navigateTo = function(obj) {
	let vk = uni.vk;
	if (typeof obj == "string") {
		let url = obj;
		obj = {
			url: url
		};
	} else if (typeof obj == "undefined") {
		obj = {};
	}
	if (!obj.url) {
		vk.toast("url不能为空!");
		return false;
	}
	util.checkNeedLogin({
		url: obj.url,
		success: function(res) {
			if (res.needLogin) {
				obj.url = vk.pubfn.getPageFullPath(obj.url);
				vk.navigate.originalPage = vk.pubfn.copyObject(obj);
				obj.url = config.login.url;
				// login拦截器开始-----------------------------------------------------------
				let { interceptor = {} } = config;
				if (typeof interceptor.login === "function") {
					let key = interceptor.login({
						vk, 
						params: obj,
						res:{
							...res,
							code: 30204,
							msg: "本地token校验未通过"
						}
					});
					if (typeof key === "undefined" || key !== true) return false;
				}
				// login拦截器结束-----------------------------------------------------------
			} else {
				vk.navigate.originalPage = null;
			}
			util._navigateTo(obj);
		}
	});
};
util._navigateTo = function(obj) {
	let { interceptor = {} } = config;
	if (typeof interceptor.navigateTo === "function") {
		let vk = uni.vk;
		obj.pagePath = vk.pubfn.getPageFullPath(obj.url);
		let key = interceptor.navigateTo({
			...obj,
			vk
		});
		if (typeof key == "boolean" && key === false) return false;
	}
	let {
		url,
		animationType = "pop-in",
		animationDuration = 300,
		events,
		mode = "navigateTo"
	} = obj;
	// 此处写法仅为支持vue3，vue3不支持uni[apiName]的形式调用
	let navigateFn;
	if (mode === "navigateTo") {
		navigateFn = uni.navigateTo;
	} else if (mode === "redirectTo") {
		navigateFn = uni.redirectTo;
	} else if (mode === "reLaunch") {
		navigateFn = uni.reLaunch;
	} else if (mode === "switchTab") {
		navigateFn = uni.switchTab;
	} else {
		navigateFn = uni.navigateTo;
	}
	// 此处写法仅为支持vue3，vue3不支持uni[apiName]的形式调用
	navigateFn({
		url: url,
		animationType: animationType,
		animationDuration: animationDuration,
		events: events, // 参考 https://uniapp.dcloud.io/api/router?id=navigateto
		success: function(res) {
			if (typeof obj.success == "function") obj.success(res);
		},
		fail: function(err) {
			if (err.errMsg.indexOf("not found") > -1) {
				let vk = uni.vk;
				let errUrl = vk.pubfn.getPageFullPath(url);
				vk.toast(`页面 ${errUrl} 不存在`, "none");
				console.error(err);
				return false;
			}
			uni.switchTab({
				url: url,
				success: obj.success,
				fail: function() {
					uni.redirectTo({
						url: url,
						success: obj.success,
						fail: function(err) {
							console.error(err);
							if (typeof obj.fail == "function") obj.fail(err);
						}
					});
				}
			});
		},
		complete: function(res) {
			if (typeof obj.complete == "function") obj.complete(res);
		}
	});
};

/**
 * 关闭当前页面，跳转到应用内的某个页面。
 * vk.redirectTo(url);
 */
util.redirectTo = function(obj) {
	obj = util.paramsInit(obj);
	obj.mode = "redirectTo";
	util.navigateTo(obj);
};

/**
 * 关闭所有页面，打开到应用内的某个页面。
 * vk.reLaunch(url);
 */
util.reLaunch = function(obj) {
	obj = util.paramsInit(obj);
	obj.mode = "reLaunch";
	util.navigateTo(obj);
};

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
 * vk.switchTab(url);
 */
util.switchTab = function(obj) {
	obj = util.paramsInit(obj);
	obj.mode = "switchTab";
	util.navigateTo(obj);
};
/**
 * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。
 * vk.navigateBack();
 */
util.navigateBack = function(obj) {
	let vk = uni.vk;
	if (typeof obj == "number") {
		let delta = obj;
		obj = {
			delta: delta
		};
	} else if (typeof obj == "undefined") {
		obj = {};
	}
	let {
		delta = 1,
			animationType = "pop-out",
			animationDuration = 300
	} = obj;
	uni.navigateBack({
		delta: delta,
		animationType: animationType,
		animationDuration: animationDuration,
		success: function() {
			if (typeof obj.success == "function") obj.success();
		},
		fail: function(res) {
			console.error(res);
			if (typeof obj.fail == "function") obj.fail();
		},
		complete: function() {
			if (typeof obj.complete == "function") obj.complete();
		}
	});
};
/**
 * 跳转到登录前的页面
 * vk.navigate.originalTo();
 */
util.originalTo = function() {
	let vk = uni.vk;
	let originalPage = vk.pubfn.copyObject(vk.navigate.originalPage);
	vk.navigate.originalPage = null;
	util.redirectTo(originalPage);
};

/**
 * 跳转到首页
 * vk.navigateToHome();
 */
util.navigateToHome = function(obj = {}) {
	let vk = uni.vk;
	let {
		mode = "reLaunch"
	} = obj;
	vk[mode](config.index.url);
};

/**
 * 跳转到登录页
 * vk.navigateToLogin();
 */
util.navigateToLogin = function(obj = {}) {
	let vk = uni.vk;
	let {
		mode = "reLaunch"
	} = obj;
	vk[mode](config.login.url);
};

/**
 * 检测是否满足条件(内部方法)
 util.checkWildcardTest({
	 url:url,
	 pagesRule:config.checkTokenPages,
	 success:function(res){
		 if(res.success){

		 }
	 }
 })
 */
util.checkWildcardTest = function(obj) {
	let vk = uni.vk;
	let {
		url,
		pagesRule
	} = obj;
	// ../ 转成绝对路径
	url = vk.pubfn.getPageFullPath(url);
	let key = false;
	if (vk.pubfn.isNotNull(pagesRule)) {
		let { mode = 0, list = [] } = pagesRule;
		if (mode > 0) {
			let regExpKey = false;
			let path = util.getPagePath(url);
			for (let i = 0; i < list.length; i++) {
				let pageRegExp = list[i];
				regExpKey = vk.pubfn.wildcardTest(path, pageRegExp);
				if (regExpKey) {
					break;
				}
			}
			if (mode === 1 && regExpKey) {
				key = true;
			} else if (mode === 2 && !regExpKey) {
				key = true;
			}
		}
	}
	return {
		url,
		key
	};
};


/**
 * 检测是否需要登录(内部方法)
 util.checkNeedLogin({
	 url:url,
	 success:function(res){
		 if(res.needLogin){

		 }
	 }
 })
 */
util.checkNeedLogin = function(obj) {
	let vk = uni.vk;
	let { url, success } = obj;
	let needLogin = false;
	let pagesRule = config.checkTokenPages;
	if (pagesRule) {
		let res = util.checkWildcardTest({
			url,
			pagesRule
		});
		if (res.key) {
			// 本地判断token有效期(联网会浪费性能)
			if (!vk.callFunctionUtil.checkToken()) {
				needLogin = true;
			}
		}
	}
	success({
		url,
		needLogin
	});
};


// 获取?前面的地址
util.getPagePath = function(url) {
	let pathIndex = url.indexOf("?");
	let path = url;
	if (pathIndex > -1) {
		path = path.substring(0, pathIndex);
	}
	return path;
};

util.paramsInit = function(obj) {
	let vk = uni.vk;
	if (typeof obj == "string") {
		let url = obj;
		obj = {
			url: url
		};
	} else if (typeof obj == "undefined") {
		obj = {};
	}
	if (!obj.url) {
		vk.toast("url不能为空!");
		return false;
	}
	return obj;
}



/**
 * 跳转到小程序
	vk.navigateToMiniProgram({
		appId: 'appId',
		path: 'pages/index/index',
		extraData:{
			//发送数据携带的参数
		},
		success(res) {
			// 打开成功

		}
	})
 */
util.navigateToMiniProgram = function(obj) {
	let vk = uni.vk;
	// #ifdef H5
	vk.toast("不支持打开小程序", "none");
	// #endif

	// #ifndef H5
	uni.navigateToMiniProgram(obj);
	// #endif
};


/**
 * 检测是否可以分享(内部方法)
 util.checkAllowShare({
	 url:url,
 });
 */
util.checkAllowShare = function(obj) {
	let vk = uni.vk;
	let { url, success } = obj;
	let pagesRule = config.checkSharePages || {};
	if (pagesRule && pagesRule.mode > 0) {
		let res = util.checkWildcardTest({
			url,
			pagesRule
		});
		// #ifdef MP
		let menus = pagesRule.menus || ['shareAppMessage', 'shareTimeline'];
		if (res.key) {
			//console.log("允许分享");
			uni.showShareMenu({
				withShareTicket: false,
				menus
			});
		} else {
			//console.log("禁止分享");
			uni.hideShareMenu({
				menus
			})
		}
		// #endif
	}
};



export default util;
