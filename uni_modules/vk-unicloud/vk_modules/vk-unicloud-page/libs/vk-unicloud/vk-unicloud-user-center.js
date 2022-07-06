/**
 * unicloud-user-center 接口类（uni-id封装）
 * author	VK
 */
import callFunctionUtil from './vk-unicloud-callFunctionUtil.js'
var { callFunction, config, saveToken, deleteToken } = callFunctionUtil;
import debounce from '../function/debounce.js'

const localeObj = {
	"zh-Hans": {
		"loading": "请求中...",
		"login": "登录中...",
		"register": "注册中...",
		"create": "生成中...",
	},
	"zh-Hant": {
		"loading": "請求中...",
		"login": "登入中...",
		"register": "注册中...",
		"create": "生成中...",
	},
	"en": {
		"loading": "loading...",
		"login": "login...",
		"register": "register...",
		"create": "create...",
	}
};

function addLoading(obj, title) {
	if (typeof obj.loading === "undefined" && !obj.title && title) {
		let locale;
		if (typeof vk !== "undefined") {
			locale = localeObj[vk.pubfn.getLocale()];
		} else {
			locale = localeObj["zh-Hans"];
		}
		obj.title = locale[title] || "loading...";
	}
	return obj;
}

export default {
	/**
	 * 用户注册(用户名+密码)
	 * data 请求参数 说明
	 * @param {String} username 用户名
	 * @param {String} password 密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 * @param {String} uid 用户ID
	 */
	register(obj = {}) {
		addLoading(obj, "register");
		return callFunction({
			...obj,
			url: 'user/pub/register'
		});
	},
	/**
	 * 用户登录(用户名+密码)
	 * data 请求参数 说明
	 * @param {String} username 用户名
	 * @param {String} password 密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 * @param {String} uid 用户ID
	 */
	login(obj = {}) {
		addLoading(obj, "login");
		return callFunction({
			...obj,
			url: 'user/pub/login'
		});
	},
	/**
	 * 登出(退出)
	 * data 请求参数 说明
	 * 无
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	logout(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/logout',
			success(res) {
				deleteToken();
				if (typeof obj.success == "function") obj.success(res);
			}
		});
	},
	/**
	 * 修改密码
	 * @description 修改成功后，需要重新登录获取新的token
	 * data 请求参数 说明
	 * @param {String} oldPassword 旧密码
	 * @param {String} newPassword 新密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	updatePwd(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/updatePwd',
		});
	},
	/**
	 * 重置密码
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	resetPwd(obj) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/resetPwd',
		});
	},
	/**
	 * 设置头像
	 * data 请求参数 说明
	 * @param {String} avatar 头像地址
	 * @param {Boolean} deleteOldFile 是否同时删除云储存内的头像文件
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	setAvatar(obj = {}) {
		addLoading(obj, "loading");
		//obj.isRequest = true;
		return callFunction({
			...obj,
			url: 'user/kh/setAvatar',
		});
	},
	/**
	 * 设置昵称等用户展示的个人信息
	 * data 请求参数 说明
	 * @param {String} nickname 昵称
	 * @param {String} avatar 头像
	 * @param {Number} gender 性别
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	updateUser(obj = {}) {
		addLoading(obj, "loading");
		callFunction({
			...obj,
			url: 'user/kh/updateUser'
		});
	},
	/**
	 * 获取用户最新信息
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 错误信息
	 * @param {Object} userInfo 用户信息
	 */
	getCurrentUserInfo(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/getMyUserInfo',
		});
	},
	/**
	 * token校验
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} uid 当前token对应的用户uid
	 * @param {Object} userInfo 当前用户信息
	 * @param {Array} role 当前用户角色
	 * @param {Array} permission 当前用户权限
	 */
	checkToken(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/checkToken',
		});
	},
	/**
	 * 绑定手机号
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindMobile(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/bindMobile',
		});
	},
	/**
	 * 解绑手机号
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindMobile(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/unbindMobile',
		});
	},
	/**
	 * 绑定新的手机号（换绑手机号）
	 * data 请求参数 说明
	 * @param {String} oldMobile 旧手机号码
	 * @param {String} oldMobileCode 旧手机收到的验证码
	 * @param {String} mobile 新手机号码
	 * @param {String} code 新手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindNewMobile(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/bindNewMobile',
		});
	},
	/**
	 * 手机号登录(手机号+手机验证码)
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} code 验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginBySms(obj = {}) {
		addLoading(obj, "login");
		return callFunction({
			url: 'user/pub/loginBySms',
			...obj
		});
	},
	/**
	 * 发送手机号验证码
	 * data 请求参数 说明
	 * @param {String} mobile 手机号
	 * @param {String} type  验证码类型
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {Object} requestRes 原始返回数据
	 * @param {Object} requestParam 包含服务供应商和发送的手机号
	 */
	sendSmsCode(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/sendSmsCode',
		});
	},
	/**
	 * APP端 手机一键登录
	 * data 请求参数 说明
	 * @param {String} access_token 			uni.login登录成功后，返回的access_token参数
	 * @param {String} openid 						uni.login登录成功后，返回的openid参数
	 * @param {String} type 							指定操作类型，可选值为login、register，不传此参数时表现为手机号已注册则登录，手机号未注册则进行注册
	 * @param {String} password 					密码，type为register时生效
	 * @param {String} inviteCode 				邀请人的邀请码，type为register时生效
	 * @param {String} myInviteCode 			设置当前注册用户自己的邀请码，type为register时生效
	 * res 返回参数说明
	 * @param {Number} code			错误码，0表示成功
	 * @param {String} msg				详细信息
	 * @param {String} uid 			当前token对应的用户uid
	 * @param {String} type			操作类型，login为登录、register为注册
	 * @param {String} mobile		登录者手机号
	 * @param {String} userInfo	用户全部信息
	 * @param {String} token			登录成功之后返回的token信息
	 * @param {String} tokenExpired		token过期时间
	 */
	loginByUniverify(obj = {}) {
		vk.showLoading('加载中...');
		if (typeof obj.needAlert === "undefined") obj.needAlert = true;
		// #ifdef APP-PLUS
		uni.login({
			provider: 'univerify',
			univerifyStyle: obj.univerifyStyle,
			success(res) {
				let dataJson = Object.assign(obj.data, res.authResult);
				callFunction({
					url: 'user/pub/loginByUniverify',
					...obj,
					data: dataJson,
				});
			},
			fail: obj.fail,
			complete: (res) => {
				vk.hideLoading();
			}
		});
		// #endif
		// #ifndef APP-PLUS
		vk.toast("请在APP中使用本机号码一键登录", "none");
		// #endif
	},

	/**
	 * 绑定邮箱
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} code  邮箱收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindEmail(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/bindEmail',
		});
	},
	/**
	 * 解绑邮箱
	 * @param {String} email 邮箱
	 * @param {String} code  邮箱收到的验证码
	 */
	unbindEmail(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/unbindEmail',
		});
	},
	/**
	 * 绑定新的邮箱（换绑邮箱）
	 * @param {String} oldEmail 旧邮箱码
	 * @param {String} oldEmailCode 旧邮箱收到的验证码
	 * @param {String} email 新邮箱码
	 * @param {String} code 新邮箱收到的验证码
	 */
	bindNewEmail(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/bindNewEmail',
		});
	},
	/**
	 * 邮箱登录(邮箱+邮箱验证码)
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} code  邮箱收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByEmail(obj = {}) {
		addLoading(obj, "login");
		return callFunction({
			url: 'user/pub/loginByEmail',
			...obj
		});
	},
	/**
	 * 发送邮件验证码
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * @param {String} type  验证码类型
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} email 手机号
	 * @param {String} verifyCode 验证码
	 */
	sendEmailCode(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/sendEmailCode',
		});
	},
	/**
	 * 根据邮箱+验证码重置密码
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * @param {String} code 验证码
	 * @param {String} email 邮箱号码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	resetPasswordByEmail(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/resetPasswordByEmail',
		});
	},
	/**
	 * 设置验证码
	 * @description 设置验证码(此接口正式环境不要暴露,故写在了sys目录下)
	 * data 请求参数 说明
	 * @param {String} email  邮箱
	 * @param {String} mobile 手机号
	 * @param {String} type  验证码类型
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} email 邮箱
	 * @param {String} mobile 手机号
	 * @param {String} verifyCode 验证码(uni 1.1.2开始不再返回verifyCode)
	 */
	setVerifyCode(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/sys/setVerifyCode',
		});
	},
	/**
	 * 微信登录获取用户code
	 */
	getWeixinCode() {
		return new Promise((resolve, reject) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success(res) {
					resolve(res.code)
				},
				fail(err) {
					reject(new Error('微信登录失败'))
				}
			})
			// #endif
			// #ifdef APP-PLUS
			plus.oauth.getServices((services) => {
				let weixinAuthService = services.find((service) => {
					return service.id === 'weixin';
				});
				if (weixinAuthService) {
					weixinAuthService.authorize(function(res) {
						resolve(res.code);
					}, function(err) {
						console.log(err);
						reject(new Error('微信登录失败'));
					});
				}
			});
			// #endif
			// #ifdef H5
			resolve();
			// #endif
		})
	},
	/**
	 * 用户登录(微信授权)
	 * @description 用户登录(微信授权)
	 * data 请求参数 说明
	 * @param {String} code 微信登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByWeixin(obj = {}) {
		let that = this;
		debounce(function() {
			addLoading(obj, "login");
			let { data = {} } = obj;
			that.getWeixinCode().then((code) => {
				// #ifdef H5
				// H5平台需要区分环境（如微信公众号？网页H5?）
				data.vk_platform = uni.vk.h5.getEnv();
				// #endif
				callFunction({
					url: 'user/pub/loginByWeixin',
					...obj,
					data: {
						code,
						...data
					}
				});
			});
		}, 500);
	},
	/**
	 * 获取微信openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} unionid 用户unionid，可以取到此值时返回
	 * @param {String} sessionKey 客户端为微信小程序时返回
	 * @param {String} accessToken 客户端为APP时返回
	 * @param {String} expiresIn 客户端为APP时返回，accessToken 接口调用凭证超时时间，单位（秒）
	 * @param {String} refreshToken 客户端为APP时返回，用于刷新accessToken
	 */
	code2SessionWeixin(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		let { data = {} } = obj;
		that.getWeixinCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/pub/code2SessionWeixin',
				data: {
					code,
					...data,
				}
			});
		});
	},
	/**
	 * 绑定微信
	 * @description 将当前登录用户绑定微信
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindWeixin(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		let { data = {} } = obj;
		that.getWeixinCode().then((code) => {
			// #ifdef H5
			// H5平台需要区分环境（如微信公众号？网页H5?）
			data.vk_platform = uni.vk.h5.getEnv();
			// #endif
			callFunction({
				...obj,
				url: 'user/kh/bindWeixin',
				data: {
					code,
					...data
				}
			});
		});
	},
	/**
	 * 解绑微信
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindWeixin(obj = {}) {
		addLoading(obj, "loading");
		let { data = {} } = obj;
		// #ifdef H5
		// H5平台需要区分环境（如微信公众号？网页H5?）
		data.vk_platform = uni.vk.h5.getEnv();
		obj.data = data;
		// #endif
		return callFunction({
			...obj,
			url: 'user/kh/unbindWeixin',
		});
	},
	/**
	 * 获取微信绑定的手机号(后面会支持支付宝)
	 * data 请求参数
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 */
	getPhoneNumber(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/getPhoneNumber'
		});
	},
	/**
	 * 通过微信小程序绑定的手机号登录
	 * data 请求参数 说明
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByWeixinPhoneNumber(obj = {}) {
		addLoading(obj, "login");
		return callFunction({
			url: 'user/pub/loginByWeixinPhoneNumber',
			...obj
		});
	},
	/**
	 * 生成微信小程序码
	 * @param {String} scene        自定义参数最大32个可见字符 只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~
	 * @param {String} page         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * @param {number} width        二维码的宽度，单位 px，最小 280px，最大 1280px
	 * @param {boolean} auto_color  自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false
	 * @param {Object} line_color   auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
	 * @param {boolean} is_hyaline  是否需要透明底色，为 true 时，生成透明底色的小程序
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getWeixinMPqrcode(obj = {}) {
		addLoading(obj, "create");
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPqrcode',
		});
	},
	/**
	 * 生成微信小程序scheme码
	 * data 请求参数 说明
	 * @param {String} path    小程序页面路径
	 * @param {String} query   小程序页面参数
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	getWeixinMPscheme(obj = {}) {
		addLoading(obj, "create");
		return callFunction({
			...obj,
			url: 'user/kh/getWeixinMPscheme',
		});
	},
	/**
	 * 获取支付宝code
	 */
	getAlipayCode() {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'alipay',
				success(res) {
					resolve(res.code);
				},
				fail(err) {
					reject(new Error('支付宝登录失败'));
				}
			})
		})
	},
	/**
	 * 支付宝登录
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByAlipay(obj = {}) {
		let that = this;
		debounce(function() {
			addLoading(obj, "login");
			let { data = {} } = obj;
			that.getAlipayCode().then((code) => {
				callFunction({
					url: 'user/pub/loginByAlipay',
					...obj,
					data: {
						...data,
						code: code
					}
				});
			});
		}, 500);
	},
	/**
	 * 获取支付宝openid
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} openid 用户openid
	 * @param {String} accessToken 客户端为APP时返回
	 * @param {String} expiresIn 客户端为APP时返回，accessToken 接口调用凭证超时时间，单位（秒）
	 * @param {String} refreshToken 客户端为APP时返回，用于刷新accessToken
	 * @param {String} reExpiresIn refreshToken超时时间，单位（秒）
	 */
	code2SessionAlipay(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		let { data = {} } = obj;
		that.getAlipayCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/pub/code2SessionAlipay',
				data: {
					...data,
					code: code
				}
			});
		});
	},
	/**
	 * 绑定支付宝
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindAlipay(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		let { data = {} } = obj;
		that.getAlipayCode().then((code) => {
			callFunction({
				...obj,
				url: 'user/kh/bindAlipay',
				data: {
					...data,
					code: code
				}
			});
		});
	},
	/**
	 * 解绑支付宝
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindAlipay(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/unbindAlipay',
		});
	},
	/**
	 * 密码加密测试(暂不用)
	 */
	encryptPwd(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/sys/encryptPwd',
		});
	},
	// 1.1.2新增
	/**
	 * 设置用户邀请码(自动生成)
	 * @description 针对未生成邀请码的用户使用此方法生成邀请码(自动生成)
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} myInviteCode 最终设置的邀请码
	 */
	setUserInviteCode(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/setUserInviteCode',
		});
	},
	/**
	 * 用户接受邀请
	 * @description 此接口用于在注册之后再填写邀请码的场景，多数情况下不会用到此接口而是在注册时填写邀请码
	 * data 请求参数 说明
	 * @param {String} inviteCode 邀请人的邀请码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	acceptInvite(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/acceptInvite',
		});
	},
	/**
	 * 获取接受邀请的用户清单
	 * data 请求参数 说明
	 * @param {Number}         pageIndex 当前页码
	 * @param {Number}         pageSize  每页显示数量
	 * @param {Array<Object>}  sortRule  排序规则
	 * @param {object}         formData  查询条件数据源
	 * @param {Array<Object>}  columns   查询条件规则
	 * res 返回参数说明
	 * @param {Number}         code      错误码，0表示成功
	 * @param {String}         msg       详细信息
	 */
	getInvitedUser(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/getInvitedUser',
		});
	},
	/**
	 * 根据手机验证码重置账号密码
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * @param {String} code 验证码
	 * @param {String} mobile 手机号
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	resetPasswordByMobile(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/pub/resetPasswordByMobile',
		});
	},
	/**
	 * 获取我拥有的菜单列表
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} menus 树形结构的菜单
	 * @param {String} menuList 数组结构的菜单
	 * @param {String} userInfo 用户信息
	 */
	getMenu(obj = {}) {
		return callFunction({
			...obj,
			url: 'user/kh/getMenu'
		});
	},
	/**
	 * 添加文件上传记录
	 * data 请求参数 说明
	 * @param {String} url					文件外网访问url
	 * @param {String} name 				文件名
	 * @param {Number} size				文件大小
	 * @param {String} file_id			文件id
	 * @param {String} provider		供应商
	 * @param {String} category_id 分类ID
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	addUploadRecord(obj = {}) {
		let { fileType, filePath } = obj;
		if (fileType === "image") {
			uni.getImageInfo({
				src: filePath,
				success: function(res) {
					return callFunction({
						...obj,
						url: 'user/kh/addUploadRecord',
						data: {
							...obj.data,
							orientation: res.orientation,
							width: res.width,
							height: res.height
						}
					});
				},
				fail: function(err) {
					console.error(err)
				}
			});
		} else if (fileType === "video") {
			uni.getVideoInfo({
				src: filePath,
				success: function(res) {
					return callFunction({
						...obj,
						url: 'user/kh/addUploadRecord',
						data: {
							...obj.data,
							duration: parseFloat(res.duration.toFixed(3)),
							width: res.width,
							height: res.height
						}
					});
				},
				fail: function(err) {
					console.error(err)
				}
			});
		} else {
			return callFunction({
				...obj,
				url: 'user/kh/addUploadRecord'
			});
		}
	},
	/**
	 * 获取QQ code
	 */
	getQQCode() {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'qq',
				success(res) {
					// #ifdef APP-PLUS
					resolve({
						accessToken: res.authResult.access_token,
					})
					// #endif
					// #ifdef MP-QQ
					resolve({
						code: res.code,
					})
					// #endif
				},
				fail(err) {
					reject(new Error('QQ登录失败'));
				}
			})
		})
	},
	/**
	 * QQ登录
	 * data 请求参数 说明
	 * @param {String} type 可传login或register，若为login：则不存在不会自动注册，若为register，则用户存在会报错，不传，则存在自动登录，不存在，则注册。
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	loginByQQ(obj = {}) {
		let that = this;
		debounce(function() {
			addLoading(obj, "login");
			let { data = {} } = obj;
			that.getQQCode().then(({ code, accessToken } = {}) => {
				callFunction({
					url: 'user/pub/loginByQQ',
					...obj,
					data: {
						...data,
						code,
						accessToken
					}
				});
			});
		}, 500);
	},
	/**
	 * 绑定QQ
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	bindQQ(obj = {}) {
		let that = this;
		addLoading(obj, "loading");
		let { data = {} } = obj;
		that.getQQCode().then(({ code, accessToken } = {}) => {
			callFunction({
				...obj,
				url: 'user/kh/bindQQ',
				data: {
					...data,
					code,
					accessToken
				}
			});
		});
	},
	/**
	 * 解绑QQ
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	unbindQQ(obj = {}) {
		addLoading(obj, "loading");
		return callFunction({
			...obj,
			url: 'user/kh/unbindQQ',
		});
	},
};
