module.exports = {
  /**
   * 重置密码
   * @url user/kh/resetPwd 前端调用的url参数地址
   * @description 重置当前登录用户的密码为123456
	 * data 请求参数 说明
	 * @param {String} uid 用户Id，可以通过checkToken返回
	 * @param {String} password 重置后的密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
   */
	main: async (event) => {
		let { util, data={} } = event;
		let { uniID } = util;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		let { uid, password= '123456' } = data;
		res = await uniID.resetPwd({ uid, password });
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
