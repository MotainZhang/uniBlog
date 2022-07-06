module.exports = {
	/**
	 * 用户登录(支付宝授权)
	 * @url user/pub/loginByAlipay 前端调用的url参数地址
	 * @description 用户登录(支付宝授权)
	 * data 请求参数 说明
	 * @param {String} code 支付宝登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * @param {String} type login:登录 register:注册
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		res = await uniID.loginByAlipay(data);
		if (res.token) {
			if (!res.msg) {
				res.msg = res.type === "register" ? "注册成功" : "登录成功";
			}
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "alipay",
				user_id: res.uid,
				context: originalParam.context
			}, util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
