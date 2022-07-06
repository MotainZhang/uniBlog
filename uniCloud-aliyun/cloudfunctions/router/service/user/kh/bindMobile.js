module.exports = {
	/**
	 * 绑定手机号
	 * @url user/kh/bindMobile 前端调用的url参数地址
	 * @description 将当前登录用户绑定手机号
	 * data 请求参数 说明
	 * @param {String} mobile 用户手机号
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, util } = event;
		let { uniID } = util;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		if (!data.code) return { code: -1, msg: "验证码不能为空！" }
		// 绑定手机号
		res = await uniID.bindMobile(data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
