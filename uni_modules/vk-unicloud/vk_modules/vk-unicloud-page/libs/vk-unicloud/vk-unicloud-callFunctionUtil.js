var vk = {};
var counterNum = 0;
var uniCloudEnvs = {};
class CallFunctionUtil {
	constructor() {
		this.config = {
			// 是否开启测试环境的云函数，true：使用测试环境，false：使用正式环境，默认true
			isTest: false,
			// 设为false可关闭打印日志
			debug: true,
			// 云函数路由（主函数名）
			functionName: "router",
			// 云函数路由（开发测试函数名）
			testFunctionName: "router-test",
			// 云函数url化后对应的url地址
			functionNameToUrl: {
				"router": "https://xxxxxxx.bspapp.com/http/router",
				"router-test": "https://xxxxxxx.bspapp.com/http/router"
			},
			// vk.callFunction的isRequest的默认值
			isRequestDefault:false,
			// 默认时区（中国为8）
			targetTimezone:8,
			// 客户端登录页面地址
			login: {
				url: '/pages_template/uni-id/login/index/index'
			},
			// 请求配置
			request: {
				// 公共请求参数(每次请求都会带上的参数)
				dataParam: {}
			},
			// 日志风格
			logger: {
				colorArr: [
					"#0095ff",
					"#67C23A"
				]
			},
			// 缓存键名 - token（请勿修改）
			uniIdTokenKeyName: "uni_id_token",
			// 缓存键名 - token过期时间（请勿修改）
			uniIdTokenExpiredKeyName: "uni_id_token_expired",
			// 缓存键名 - 当前登录用户信息（请勿修改）
			uniIdUserInfoKeyName: "uni_id_user_info",
			// 缓存键名 - 公共请求参数（请勿修改）
			requestGlobalParamKeyName: "vk_request_global_param",
			// 自定义组件配置
			components: {}
		}
		// 保存新的token
		this.saveToken = (res = {}) => {
			let config = this.config;
			vk.setStorageSync(config.uniIdTokenKeyName, res.token);
			vk.setStorageSync(config.uniIdTokenExpiredKeyName, res.tokenExpired);
			if (this.config.debug) console.log("--------【token已更新】--------");
		}
		// 删除token，并删除userInfo缓存
		this.deleteToken = () => {
			let config = this.config;
			vk.removeStorageSync(config.uniIdTokenKeyName);
			vk.removeStorageSync(config.uniIdTokenExpiredKeyName);
			this.deleteUserInfo();
			if (this.config.debug) console.log("--------【token已删除】--------");
		}
		// 更新userInfo缓存
		this.updateUserInfo = (res = {}) => {
			let config = this.config;
			let {
				userInfo = {}
			} = res;
			if (typeof vk.setVuex === "function") {
				// 有安装vuex则使用vuex
				vk.setVuex('$user.userInfo', userInfo);
			} else {
				// 否则使用本地缓存
				vk.setStorageSync(config.uniIdUserInfoKeyName, userInfo);
			}
			//if (this.config.debug) console.log("--------【用户信息已更新】--------");
		}
		// 删除userInfo缓存
		this.deleteUserInfo = (res = {}) => {
			let config = this.config;
			if (typeof vk.setVuex === "function") {
				// 有安装vuex则使用vuex
				vk.setVuex('$user.userInfo', {});
				vk.setVuex('$user.permission', []);
				vk.removeStorageSync(config.uniIdUserInfoKeyName);
			} else {
				// 否则使用本地缓存
				vk.removeStorageSync(config.uniIdUserInfoKeyName);
			}
			if (this.config.debug) console.log("--------【用户信息已删除】--------");
		}
		// 检查token是否有效(本地版)
		// let valid = vk.callFunctionUtil.checkToken();
		this.checkToken = (res = {}) => {
			let config = this.config;
			let token = uni.getStorageSync(config.uniIdTokenKeyName);
			let tokenExpired = uni.getStorageSync(config.uniIdTokenExpiredKeyName);
			let valid = false;
			if (token && tokenExpired && tokenExpired > Date.now()) {
				valid = true;
			}
			return valid;
		}
		/**
		 * 修改请求配置中的公共请求参数
		 * 若把shop-manage改成*则代表全局
			vk.callFunctionUtil.updateRequestGlobalParam({
				"shop-manage":{
					regExp:"^xxx/kh/",
					data:{
						shop_id : shop_id
					}
				}
			});
			对应的callFunction中增加参数globalParamName:"shop-manage"
			vk.callFunction({
				url: 'xxx/xxxxxx',
				title: '请求中...',
				globalParamName:"shop-manage",// 如果设置了正则规则,则不需要此参数
				data: {},
				success(data) {
				}
			});
		 */
		this.updateRequestGlobalParam = (data = {}, setKey) => {
			let config = this.config;
			if (setKey) {
				// 覆盖对象
				config.request.dataParam = data;
			} else {
				// 覆盖参数（有就覆盖，没有则新增）
				let dataParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
				config.request.dataParam = Object.assign(dataParam, data);
			}
			vk.setStorageSync(config.requestGlobalParamKeyName, config.request.dataParam);
		}
		/**
		 * 获取请求配置中的公共请求参数
			vk.callFunctionUtil.getRequestGlobalParam();
		 */
		this.getRequestGlobalParam = (globalParamName = "*") => {
			let config = this.config;
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
			vk.callFunctionUtil.deleteRequestGlobalParam(globalParamName);
		 */
		this.deleteRequestGlobalParam = (globalParamName) => {
			let config = this.config;
			let globalParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
			if (globalParamName) {
				delete globalParam[globalParamName];
			} else {
				globalParam = {};
			}
			config.request.dataParam = globalParam;
			vk.setStorageSync(config.requestGlobalParamKeyName, globalParam);
		}
		// 拦截器
		this.interceptor = {
			// 拦截1301、1302错误码（非法token和token失效）
			login: (obj = {}) => {
				let {
					params,
					res
				} = obj;
				let config = this.config;
				let callFunction = this.callFunction;
				if (config.debug) console.log("跳登录页面");
				let { tokenExpiredAutoDelete = true } = config;
				if (tokenExpiredAutoDelete) this.deleteToken();
				setTimeout(() => {
					if (config.login.url) {
						let currentPage = getCurrentPages()[getCurrentPages().length - 1];
						if (currentPage && currentPage.route && "/" + currentPage.route === config.login.url) {
							return false;
						}
						// 此处代码是为了防止首页启动时检测和正常检测冲突-----------------------------------------------------------
						if (vk.navigate.isOnLaunchToLogin) {
							setTimeout(() => {
								vk.navigate.isOnLaunchToLogin = false;
							}, 500);
							return false;
						}
						// 此处代码是为了防止首页启动时检测和正常检测冲突-----------------------------------------------------------
						uni.navigateTo({
							url: config.login.url,
							events: {
								// 监听登录成功后的事件
								loginSuccess: function(data) {
									let num = 2;
									let pages = getCurrentPages();
									if (pages.length >= num) {
										let that = pages[pages.length - num];
										if (typeof that.onLoad == "function") {
											// 重新执行页面onLoad函数
											that.onLoad(that.options);
										} else if (typeof that.init == "function") {
											// 重新执行页面初始化函数
											that.init(that.options);
										} else {
											// 重新执行一次云函数调用
											callFunction(params);
										}
									} else {
										// 重新执行一次云函数调用
										callFunction(params);
									}
								}
							}
						});
					} else {
						if (params.needAlert) {
							vk.alert(res.result.msg);
						}
					}
				}, 0);
			},
			// 全局请求失败拦截器
			fail: (obj = {}) => {
				return true;
			}
		}
		/**
		 * 云函数请求封装 - 统一入口
		 * @description 通过云函数路由，1个云函数实现多个云函数的效果。
		 * @param {String}   url       请求路径
		 * @param {Object}   data      请求参数，如 { a:1, b:"2" } 云函数内可通过 let { a, b } = data; 获取参数
		 * @param {String} 	 title     遮罩层提示语，为空或不传则代表不显示遮罩层。
		 * @param {Boolean}  isRequest 是否使用云函数url化地址访问云函数，默认false
		 * @param {Boolean}  needAlert 为true代表请求错误时，会有弹窗提示，默认为true
		 * @param {Function} success   请求成功时，执行的回调函数
		 * @param {Function} fail  	 	 请求失败时，执行的回调函数
		 * @param {Function} complete  无论请求成功与否，都会执行的回调函数
		 */
		this.callFunction = (obj = {}) => {
			let that = this;
			let { config } = that;
			let {
				url,
				data = {},
				globalParamName
			} = obj;

			if (obj.retryCount) {
				// 系统异常重试机制（表单提交时慎用，建议只用在查询请求中，即无任何数据库修改的请求中）
				return that.callFunctionRetry(obj);
			}
			// 去除值为 undefined 的参数
			if (typeof data === "object") {
				obj.data = vk.pubfn.copyObject(data);
			}
			// 注入自定义全局参数开始-----------------------------------------------------------
			let globalParam = uni.getStorageSync(config.requestGlobalParamKeyName) || {};
			// 根据正则规格自动匹配全局请求参数
			for (let i in globalParam) {
				let customDate = globalParam[i];
				if (customDate.regExp) {
					if (typeof customDate.regExp === "object") {
						// 数组形式
						for (let i = 0; i < customDate.regExp.length; i++) {
							let regExp = new RegExp(customDate.regExp[i]);
							if (regExp.test(url)) {
								obj.data = Object.assign(customDate.data, obj.data);
								break;
							}
						}
					} else {
						// 字符串形式
						let regExp = new RegExp(customDate.regExp);
						if (regExp.test(url)) {
							obj.data = Object.assign(customDate.data, obj.data);
						}
					}
				}
			}
			// 根据指定globalParamName匹配全局请求参数
			let customDate = that.getRequestGlobalParam(globalParamName);
			if (customDate && JSON.stringify(customDate) !== "{}") {
				if (customDate.regExp) {
					obj.data = Object.assign(customDate.data, obj.data); // 新版本
				} else {
					obj.data = Object.assign(customDate, obj.data); // 兼容旧版本
				}
			}
			// 注入自定义全局参数结束-----------------------------------------------------------
			// 若执行的函数不是pub类型函数，则先本地判断下token，可以提高效率。
			// if (url.indexOf("/pub/") == -1 && url.indexOf("/pub_") == -1) {
			// 若执行的函数是kh或sys类型函数，先本地判断下token，可以提高效率。
			if (url.indexOf("/kh/") > -1 || url.indexOf("/sys/") > -1 || (url.indexOf(".") > -1 && url.indexOf("pub_") == -1 && url.indexOf("/pub/") == -1 && url.indexOf("/pub.") == -1 && url.indexOf("pub.") !== 0 && url.indexOf("pub_") !== 0)) {
				if (!vk.checkToken()) {
					// 若本地token校验未通过，则直接执行 login 拦截器函数
					return new Promise((resolve, reject) => {
						// 执行 login 拦截器函数（跳转到页面页面）
						let res = { code: 30204, msg: "本地token校验未通过" };
						let params = obj;
						if (typeof that.interceptor.login === "function") {
							that.interceptor.login({
								res,
								params,
								vk
							});
						}
						reject(res);
					});
				}
			}
			if (typeof obj.isRequest === "undefined"){
				obj.isRequest = config.isRequestDefault;
			}
			// 执行请求
			if (obj.isRequest) {
				return that.runRequest(obj);
			} else {
				return that.runCallFunction(obj);
			}
		}

		// 设置全局默认配置
		this.setConfig = (customConfig = {}) => {
			for (let key in customConfig) {
				if (key === "vk") {
					vk = customConfig[key];
				} else if (key === "interceptor") {
					this.interceptor = Object.assign(this.interceptor, customConfig[key]);
					this.config.interceptor = customConfig[key];
				} else if (key === "myfn") {
					vk.myfn = customConfig[key];
				} else if (key === "loginPagePath") {
					// 兼容老版本
					this.config.login.url = customConfig[key];
				} else if (key === "uniCloud") {
					let uniCloudConfig = customConfig[key];
					if (uniCloudConfig && uniCloudConfig.envs) {
						for (let envKey in uniCloudConfig.envs) {
							let envItem = uniCloudConfig.envs[envKey];
							if (envItem && envItem.provider && envItem.spaceId) {
								let initConifg = {
									provider: envItem.provider,
									spaceId: envItem.spaceId
								};
								if (envItem.clientSecret) initConifg.clientSecret = envItem.clientSecret;
								if (envItem.endpoint) initConifg.endpoint = envItem.endpoint;
								uniCloudEnvs[envKey] = uniCloud.init(initConifg);
							}
						}
					}
				} else if (typeof customConfig[key] === "object" && typeof this.config[key] === "object") {
					this.config[key] = Object.assign(this.config[key], customConfig[key]);
				} else if (typeof customConfig[key] !== "undefined") {
					this.config[key] = customConfig[key];
				}
			}
		}
		// 获取全局默认配置
		this.getConfig = () => {
			return this.config;
		}

		// 初始化
		this.init = (obj = {}) => {
			vk = obj.vk;
		}
		/**
		 * 云函数上传图片
		 * @param {String} 	filePath   	要上传的文件对象
		 * @param {String} 	cloudPath  	文件的绝对路径，包含文件名(若不传，会自动生成文件名)
		 * @param {String} 	fileType 		文件类型，可选image、video、audio 默认image
		 * @param {Function} onUploadProgress 	上传进度回调
		 * @param {Function} success  					请求成功时，执行的回调函数
		 * @param {Function} fail  	 					请求失败时，执行的回调函数
		 * @param {Function} complete 					无论请求成功与否，都会执行的回调函数
		 * vk.callFunctionUtil.uploadFile
		 */
		this.uploadFile = (obj = {}) => {
			let that = this;
			let config = that.config;
			let {
				filePath,
				cloudPath,
				title,
				errorToast,
				needAlert,
				success,
				fail,
				complete,
				type,
				provider,
				file = {},
				needSave = false,
				category_id,
				uniCloud: myCloud,
				env = "default"
			} = obj;
			// 获取文件类型(image:图片 video:视频 other:其他)
			let fileType = this.getFileType(obj);
			obj.fileType = fileType;
			if (type && !provider) provider = type;
			if (!provider) {
				let aliyunOSS = vk.pubfn.getData(config, "service.aliyunOSS");
				if (aliyunOSS && aliyunOSS.isDefault) {
					provider = "aliyun";
				} else {
					provider = "unicloud";
				}
			}
			if (provider === "aliyun") {
				return vk.aliyunOSSUtil.uploadFile(obj);
			}
			if (title) vk.showLoading(title);
			if (errorToast) needAlert = false;
			// 生成文件名
			if (!cloudPath) cloudPath = this.createFileName(obj);
			let Logger = {};
			if (config.debug) Logger.filePath = filePath;
			if (config.debug) Logger.startTime = Date.now();
			let runCloud = myCloud || uniCloudEnvs[env] || uniCloud;
			return new Promise((resolve, reject) => {
				runCloud.uploadFile({
					filePath: filePath,
					cloudPath: cloudPath,
					fileType: fileType,
					onUploadProgress: function(progressEvent) {
						let percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						if (typeof obj.onUploadProgress == "function") {
							obj.onUploadProgress({
								progressEvent,
								percentCompleted,
								progress: percentCompleted
							});
						}
					},
					success(res) {
						if (config.debug) Logger.result = typeof res == "object" ? JSON.parse(JSON.stringify(res)) : res;
						if (title) vk.hideLoading();
						uniCloud.getTempFileURL({
							fileList: [res.fileID],
							success(data) {
								let { fileID, tempFileURL } = data.fileList[0];
								res.fileID = tempFileURL;
								res.url = tempFileURL;
								res.file_id = fileID;
								if (config.debug) Logger.result.url = tempFileURL;
								if (typeof success == "function") success(res);
								resolve(res);
								if (needSave) {
									// 保存文件记录到数据库
									vk.userCenter.addUploadRecord({
										data: {
											url: res.url,
											name: file.name,
											size: file.size,
											file_id: res.file_id,
											provider,
											category_id,
										},
										filePath,
										fileType,
										success: function() {
											if (typeof obj.addSuccess == "function") obj.addSuccess(res);
										},
										fail: function(res) {
											if (typeof obj.addFail === "function") obj.addFail(res);
										}
									});
								}
							}
						});
					},
					fail(err) {
						if (title) vk.hideLoading();
						if (config.debug) Logger.error = err;
						if (errorToast) vk.toast(JSON.stringify(err), "none");
						if (needAlert) {
							if (config.debug) vk.alert(JSON.stringify(err));
						}
						if (typeof fail == "function") fail(err);
						reject(err);
					},
					complete() {
						if (config.debug) {
							Logger.endTime = Date.now();
							Logger.runTime = (Logger.endTime - Logger.startTime);
							let colorArr = config.logger.colorArr;
							let colorStr = colorArr[counterNum % colorArr.length];
							counterNum++;
							console.log("%c--------【开始】【文件上传】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
							console.log("【本地文件】: ", Logger.filePath);
							console.log("【返回数据】: ", Logger.result);
							console.log("【预览地址】: ", Logger.result.fileID);
							console.log("【上传耗时】: ", Logger.runTime, "毫秒");
							console.log("【上传时间】: ", vk.pubfn.timeFormat(Logger.startTime, "yyyy-MM-dd hh:mm:ss"));
							if (Logger.error) console.error("【error】:", Logger.error);
							console.log("%c--------【结束】【文件上传】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
						}
						if (typeof complete == "function") complete();
					}
				});
			});
		}
	}
	// 云函数普通请求
	runCallFunction(obj = {}) {
		let that = this;
		let config = that.config;
		let {
			url,
			data,
			title,
			loading,
			isRequest,
			name,
			complete,
			uniCloud: myCloud,
			env = "default"
		} = obj;
		if (title) vk.showLoading(title);
		if (loading) vk.setLoading(true, loading);
		if (!name) name = config.isTest ? config.testFunctionName : config.functionName;
		obj.name = name;
		let Logger = {};
		if (config.debug) Logger.params = typeof data == "object" ? JSON.parse(JSON.stringify(data)) : data;
		let promiseAction = new Promise(function(resolve, reject) {
			if (config.debug) Logger.startTime = Date.now();
			let runCloud = myCloud || uniCloudEnvs[env] || uniCloud;
			runCloud.callFunction({
				name: name,
				data: {
					$url: url,
					data: data
				},
				success(res = {}) {
					that.callFunctionSuccess({
						res: res.result,
						params: obj,
						Logger,
						resolve,
						reject
					});
				},
				fail(res) {
					that.callFunctionFail({
						res,
						params: obj,
						Logger,
						reject,
						sysFail: true
					});
				},
				complete(res) {
					that.callFunctionComplete({
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

	// 云函数url化请求
	runRequest(obj = {}) {
		let that = this;
		let config = that.config;
		let {
			url,
			data,
			title,
			loading,
			name,
			complete
		} = obj;
		if (typeof obj.needAlert === "undefined") obj.needAlert = true;
		if (!name) name = config.isTest ? config.testFunctionName : config.functionName;
		obj.name = name;
		let requestUrl = config.functionNameToUrl[name];
		let Logger = {};
		if (config.debug) Logger.params = typeof data == "object" ? JSON.parse(JSON.stringify(data)) : data;
		let uniIdToken = uni.getStorageSync(config.uniIdTokenKeyName);
		let tokenExpired = uni.getStorageSync(config.uniIdTokenExpiredKeyName);
		if (title) vk.showLoading(title);
		if (loading) vk.setLoading(true, loading);
		let promiseAction = new Promise(function(resolve, reject) {
			if (config.debug) Logger.startTime = Date.now();
			uni.request({
				method: "POST",
				url: requestUrl,
				data: {
					$url: url,
					data: data,
					uniIdToken: uniIdToken
				},
				success(res = {}) {
					that.callFunctionSuccess({
						res: res.data,
						params: obj,
						Logger,
						resolve,
						reject
					});
				},
				fail(res) {
					that.callFunctionFail({
						res,
						params: obj,
						Logger,
						reject,
						sysFail: true
					});
				},
				complete(res) {
					that.callFunctionComplete({
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

	// 云函数请求成功时执行
	callFunctionSuccess(obj) {
		let that = this;
		let config = that.config;
		let {
			res = {},
				params,
				Logger,
				resolve,
				reject
		} = obj;
		let {
			title,
			loading,
			success
		} = params;
		if (title) vk.hideLoading();
		if (loading) vk.setLoading(false, loading);
		if (typeof res.code === "undefined" && typeof res.errCode !== "undefined") res.code = res.errCode;
		let code = res.code;
		if (config.debug) Logger.result = typeof res == "object" ? JSON.parse(JSON.stringify(res)) : res;
		if (code == 0 || res.key == 1 || (code == undefined && res.uid)) {
			if (res.vk_uni_token) that.saveToken(res.vk_uni_token);
			if (res.userInfo && res.needUpdateUserInfo) that.updateUserInfo(res);
			if (typeof success == "function") success(res);
			resolve(res);
		} else if ([1301, 1302, 30201, 30202, 30203, 30204].indexOf(code) > -1 && res.msg.indexOf("token") > -1) {
			// 执行 login 拦截器函数（跳转到页面页面）
			if (typeof that.interceptor.login === "function") {
				that.interceptor.login({
					res,
					params,
					vk
				});
			}
			reject(res);
		} else {
			that.callFunctionFail({
				res,
				params,
				Logger,
				reject
			});
		}
	}

	// 云函数请求失败时执行
	callFunctionFail(obj) {
		let that = this;
		let config = that.config;
		let { globalErrorCode = {} } = config;
		let {
			res = {},
				params,
				Logger,
				reject,
				sysFail
		} = obj;
		let {
			title,
			loading,
			errorToast,
			noAlert,
			needAlert,
			fail,
		} = params;
		// 只有是系统异常时才进行重试
		if (params.needRetry) {
			if (sysFail || (res.code && [90001].indexOf(res.code) > -1)) {
				if (!obj.hookResult || (typeof obj.hookResult === "function" && !obj.hookResult(err))) {
					Logger.sysFail = true;
					if (typeof params.retry == "function") params.retry(res, params);
					return false;
				}
			}
		}

		if (typeof noAlert !== "undefined") needAlert = !noAlert;
		if (typeof needAlert === "undefined") {
			needAlert = (typeof fail === "function") ? false : true;
		}
		if (errorToast) needAlert = false;
		if (title) vk.hideLoading();
		if (loading) vk.setLoading(false, loading);
		let errMsg = "";
		let sysErr = false;
		if (typeof res.code !== "undefined") {
			if (res.msg) {
				errMsg = res.msg;
			} else if (res.errMsg) {
				errMsg = res.errMsg;
			} else if (res.message) {
				errMsg = res.message;
			}
		} else {
			sysErr = true;
			errMsg = JSON.stringify(res);
		}
		if (errMsg.indexOf("timeout") > -1) {
			sysErr = true;
			errMsg = globalErrorCode["cloudfunction-timeout"] || "请求超时，请重试！";
		}
		if (res.code >= 90001 && errMsg.indexOf("数据库") > -1) {
			sysErr = true;
		} else if ([404, 500].indexOf(res.code) > -1 && errMsg.indexOf("云函数") > -1) {
			sysErr = true;
		} else if (res.code === "SYS_ERR" && errMsg.indexOf(": request:ok") > -1) {
			errMsg = globalErrorCode["cloudfunction-unusual-timeout"] || "请求超时，但请求还在执行，请重新进入页面。";
		} else if (errMsg.indexOf("reaches burst limit") > -1) {
			errMsg = globalErrorCode["cloudfunction-reaches-burst-limit"] || "系统繁忙，请稍后再试。";
		}
		let runKey = true;
		if (typeof that.interceptor.fail == "function") {
			runKey = that.interceptor.fail({
				vk,
				res: res,
				params: params
			});
			if (runKey === undefined) runKey = true;
		}
		if (runKey) {
			Logger.error = res;
			if (errorToast) vk.toast(errMsg, "none");
			if (needAlert && vk.pubfn.isNotNull(errMsg)) {
				if (sysErr) {
					let toastMsg = globalErrorCode["cloudfunction-system-error"] || "网络开小差了！";
					vk.toast(toastMsg, "none");
				} else {
					vk.alert(errMsg);
				}
			}
			if (typeof fail == "function") fail(res);
		}
		if (typeof reject == "function") reject(res);
	}

	// 云函数请求完成后执行
	callFunctionComplete(obj) {
		let that = this;
		let config = that.config;
		let {
			res = {},
				params,
				Logger
		} = obj;
		let {
			name,
			url,
			isRequest,
			complete,
			debug: debugLog
		} = params;
		if (params.needRetry && Logger.sysFail) {
			return false;
		}
		if (typeof debugLog === "undefined") debugLog = config.debug;
		if (debugLog) {
			Logger.endTime = Date.now();
			if (isRequest) {
				Logger.label = "【url化】";
			} else {
				Logger.label = "";
			}
			Logger.runTime = (Logger.endTime - Logger.startTime);
			let colorArr = config.logger.colorArr;
			let colorStr = colorArr[counterNum % colorArr.length];
			counterNum++;
			console.log("%c--------【开始】" + Logger.label + "【云函数请求】【" + name + "】【" + url + "】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
			console.log("【请求参数】: ", Logger.params);
			console.log("【返回数据】: ", Logger.result);
			console.log("【总体耗时】: ", Logger.runTime, "毫秒【含页面渲染】");
			console.log("【请求时间】: ", vk.pubfn.timeFormat(Logger.startTime, "yyyy-MM-dd hh:mm:ss"));
			if (Logger.error) {
				console.error("【Error】: ", Logger.error);
				if (Logger.error.err && Logger.error.err.stack) {
					console.error("【Stack】: ", Logger.error.err.stack);
				}
			}
			console.log("%c--------【结束】" + Logger.label + "【云函数请求】【" + name + "】【" + url + "】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
		}
		if (typeof complete == "function") complete(res);
	}
	// 生成文件名
	createFileName(obj = {}) {
		let {
			index = 0,
				file,
				filePath
		} = obj;
		let suffix = this.getFileSuffix(obj);
		let oldName = index + "." + suffix;
		if (file && file.name) {
			let suffixName = file.name.substring(file.name.lastIndexOf(".") + 1);
			if (suffixName && suffixName.length < 5) oldName = file.name;
			// 只保留["数字","英文",".","-"]
			oldName = oldName.replace(/[^a-zA-Z.-d]/g, '');
			if (oldName.indexOf(".") == 0) oldName = "0" + oldName;
		}
		let date = new Date();
		let dateYYYYMMDD = vk.pubfn.timeFormat(date, "yyyy/MM/dd");
		let dateTime = date.getTime().toString(); // 时间戳
		// 时间戳后8位
		let dateTimeEnd8 = dateTime.substring(dateTime.length - 8, dateTime.length);
		let randomNumber = vk.pubfn.random(8); // 8位随机数
		// 文件路径
		let newFilePath = dateYYYYMMDD + "/";
		// 文件名  = 时间戳  - 随机数32位  + 后缀名
		let fileNickName = dateTimeEnd8 + "-" + randomNumber + "-" + oldName;
		// 文件名全称(包含文件路径) = 外网域名  + 文件路径  + 文件名
		let fileFullName = newFilePath + fileNickName;
		return fileFullName;
	}

	getFileSuffix(obj = {}) {
		let {
			file,
			filePath
		} = obj;
		let suffix = "png";
		if (filePath) {
			let suffixName = filePath.substring(filePath.lastIndexOf(".") + 1);
			if (suffixName && suffixName.length < 5) suffix = suffixName;
		}
		if (file) {
			if (file.path) {
				let suffixName = file.path.substring(file.path.lastIndexOf(".") + 1);
				if (suffixName && suffixName.length < 5) suffix = suffixName;
			}
			if (file.name) {
				let suffixName = file.name.substring(file.name.lastIndexOf(".") + 1);
				if (suffixName && suffixName.length < 5) suffix = suffixName;
			}
		}
		return suffix;
	}
	getFileType(obj = {}) {
		let {
			file,
			filePath
		} = obj;
		let fileType = "other";
		let suffix = this.getFileSuffix(obj);
		if (["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"].indexOf(suffix) > -1) {
			fileType = "image";
		} else if (["avi", "mp3", "mp4", "3gp", "mov", "rmvb", "rm", "flv", "mkv"].indexOf(suffix) > -1) {
			fileType = "video";
		}
		return fileType;
	}

	// 系统异常重试机制（表单提交时慎用，建议只用在查询请求中，即无任何数据库修改的请求中）
	callFunctionRetry(obj = {}) {
		let { retryCount } = obj;
		delete obj.retryCount;
		return new Promise((resolve, reject) => {
			this.callRetryFn(obj, resolve, reject, retryCount);
		});
	}
	// 重试实现
	callRetryFn(obj, resolve, reject, retryCount) {
		let that = this;
		let debug = that.config.debug;
		that.callFunction({
			...obj,
			needRetry: retryCount ? true : false, // 判断是否需要重试
			retry: function(err) {
				obj.runCount = obj.runCount ? obj.runCount + 1 : 1;
				obj.needRetry = retryCount > obj.runCount ? true : false; // 判断是否需要重试
				let errorMsg = err.message ? `异常信息：${err.message}` : "";
				if (debug) console.log(`【请求失败】正在第【${obj.runCount}】次重试：${obj.url}`);
				if (obj.retryInterval) {
					setTimeout(function() {
						that._callRetryFn(obj, resolve, reject, retryCount);
					}, obj.retryInterval);
				} else {
					// 如果无延迟，则不写setTimeout，因为setTimeout 即使time为0，也有一定延迟。
					that._callRetryFn(obj, resolve, reject, retryCount);
				}
			}
		});
	}

	_callRetryFn(obj, resolve, reject, retryCount) {
		if (obj.runCount < retryCount) {
			this.callRetryFn(obj, resolve, reject, retryCount);
		} else {
			this.callFunction(obj).catch((err) => {
				reject();
			});
		}
	}


}

export default new CallFunctionUtil
