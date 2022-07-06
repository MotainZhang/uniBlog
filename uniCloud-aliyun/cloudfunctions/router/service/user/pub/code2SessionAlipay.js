module.exports = {
  /**
   * 获取支付宝openid
   * @url user/pub/code2SessionAlipay 前端调用的url参数地址
   * data 请求参数 说明
   * @param {String} code 支付宝登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   * @param {String} openid 用户openid
	 * @param {String} accessToken 客户端为APP时返回
	 * @param {String} expiresIn 客户端为APP时返回，accessToken 接口调用凭证超时时间，单位（秒）
	 * @param {String} refreshToken 客户端为APP时返回，用于刷新accessToken
	 * @param {String} reExpiresIn refreshToken超时时间，单位（秒）
   */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, vk } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		// 用户登录(账号+密码)
		res = await uniID.code2SessionAlipay(data);
		if(res.code === 0){
			let { needCache } = data;
			if(needCache){
				await vk.globalDataCache.set(`sys-alipay-session2openid-${res.sessionKey}`, res, 60*5);
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
