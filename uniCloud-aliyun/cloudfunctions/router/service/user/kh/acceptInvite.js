module.exports = {
  /**
   * 用户接受邀请
   * @url user/kh/acceptInvite 前端调用的url参数地址
   * @description 此接口用于在注册之后再填写邀请码的场景，多数情况下不会用到此接口而是在注册时填写邀请码
	 * data 请求参数 说明
	 * @param {String} inviteCode 邀请人的邀请码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
   */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID } = util;
		let { uid, inviteCode = "" } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		res = await uniID.acceptInvite({
			uid:uid,
			inviteCode:inviteCode
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
