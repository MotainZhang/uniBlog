module.exports = {
	/**
	 * 获取微信openid
	 * @url user/pub/code2SessionWeixin 前端调用的url参数地址
	 * @description 支持APP、微信小程序、微信公众号
	 * data 请求参数 说明
	 * @param {String} code 微信登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus、h5-weixin，默认会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
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
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, vk } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			code,
			platform,
			appid,
			needCache
		} = data;
		if (!platform) platform = originalParam.context.PLATFORM;
		res = await vk.openapi.weixin.auth.code2Session({
			context: originalParam.context,
			appid,
			code
		});
		if (res.code === 0) {
			if (needCache && platform === "mp-weixin") {
				// 缓存5分钟，可以用于配合loginByWeixinPhoneNumber使用，达到效果为：绑定手机号+微信
				await vk.globalDataCache.set(`sys-weixin-session2openid-${res.sessionKey}`, res, 60 * 5);
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
