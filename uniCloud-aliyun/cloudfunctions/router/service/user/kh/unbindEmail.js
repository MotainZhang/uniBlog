module.exports = {
  /**
   * 解绑邮箱
   * @url user/kh/unbindEmail 前端调用的url参数地址
   * @description 当前登录用户解绑邮箱
	 * data 请求参数 说明
	 * @param {String} email 邮箱
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
   */
	main: async (event) => {
		let { data = {}, userInfo, util } = event;
		let { uniID, vk } = util;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		if(vk.pubfn.isNullAll(userInfo.mobile, userInfo.username, userInfo.wx_openid, userInfo.ali_openid, userInfo.qq_openid)){
			return { code : -1, msg : '为了您的账号安全，请绑定手机号后再解绑邮箱！' };
		}
		// 解绑
		res = await uniID.unbindEmail(data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
