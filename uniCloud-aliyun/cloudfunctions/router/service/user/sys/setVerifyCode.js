module.exports = {
  /**
   * 设置验证码
   * @url user/sys/setVerifyCode 前端调用的url参数地址
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
	main: async (event) => {
		let { data = {}, util } = event;
		let { uniID } = util;
		let { email, mobile, code, type } = data;
		let res = {code : -1, msg : ''};
		// 业务逻辑开始-----------------------------------------------------------
		res = await uniID.setVerifyCode(data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
