module.exports = {
  /**
   * 解绑支付宝
   * @url user/kh/unbindAlipay 前端调用的url参数地址
   * @description 当前登录用户解绑支付宝
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		// 业务逻辑开始-----------------------------------------------------------
		let { data = {}, userInfo, util } = event;
		let { uniID, vk } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		if(vk.pubfn.isNullAll(userInfo.mobile, userInfo.username)){
			return { code : -1, msg : '为了您的账号安全，请绑定手机号后再解绑支付宝！' };
		}
		// 解绑
		res = await uniID.unbindAlipay(uid);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
