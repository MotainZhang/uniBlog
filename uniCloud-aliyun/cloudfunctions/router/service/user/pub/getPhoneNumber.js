'use strict';
module.exports = {
	/**
	 * 获取用户微信绑定的手机号
	 * @url user/pub/getPhoneNumber 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} encryptedData
	 * @param {String} iv
	 * @param {String} sessionKey
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		// 若不指定appId,默认取config.uni.mp-weixin.oauth.weixin.appid;
		res = await vk.openapi.weixin.decrypt.getPhoneNumber(data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
