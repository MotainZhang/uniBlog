module.exports = {
	/**
	 * 用户登录(微信授权)
	 * @url user/pub/loginByWeixin 前端调用的url参数地址
	 * @description 支持APP、微信小程序、微信公众号
	 * data 请求参数 说明
	 * @param {String} code 微信登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus、h5-weixin，默认会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * @param {String} type login:登录 register:注册
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		// 额外写入的自定义字段数据（可以自己增加，建议只传一些显示的信息，不要传余额字段等，因为前端不可信任）
		// 注意：app的微信登录已经支持自动获取昵称和头像，前端无需再传昵称和头像。
		let custom = {
			nickname: data.nickname,
			avatar: data.avatar
		};
		/**
		 * 支持多小程序登录
		 * 此处data可以额外接收appid和appsecret参数（appid可以从前端传，而appsecret可以配置在全局配置中（common/uni-config-center/vk-unicloud/index.js），也可以自己从数据库获取）
		 * 如果不传appid，则默认使用uni-id的配置信息
		 * 特别注意：如果使用多小程序登录，则同一用户（同一个微信号）在不同小程序登录时，会分别创建不同的用户（除非小程序绑定在同一个开放平台下）。
		 */
		
		// 打开下方注释，动态赋值appid和appsecret即可支持多小程序登录
		// data.appid = "xxxx";
		// data.appsecret = "xxxx";
		
		res = await vk.openapi.weixin.loginByWeixin({
			data,
			context: originalParam.context,
			custom
		});
		if (res.token) {
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "weixin",
				user_id: res.uid,
				context: originalParam.context
			}, util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
