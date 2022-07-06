module.exports = {
	/**
	 * 验证token是否有效
	 * @url user/pub/checkToken 前端调用的url参数地址
	 * @description 验证token是否有效(会返回uid)
	 * @param {String} uniIdToken 用户token
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} uid 当前token对应的用户uid
	 * @param {Object} userInfo 当前用户信息
	 * @param {Array} role 当前用户角色
	 * @param {Array} permission 当前用户权限
	 */
	main: async (event) => {
		let { util } = event;
		let { uniID } = util;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		res = await uniID.checkToken(event.uniIdToken,{
			needPermission:true,
			needUserInfo:true
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
