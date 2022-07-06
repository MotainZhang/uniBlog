module.exports = {
	/**
	 * 强制重置用户密码
	 * @url admin/system/user/sys/resetPassword 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} user_id 用户ID
	 * @param {String} password 重置后的密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { uniID, customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let { user_id, password } = data;
		// 重置密码
		res = await uniID.resetPwd({
			uid: user_id,
			password
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
