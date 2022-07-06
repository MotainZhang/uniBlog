module.exports = {
	/**
	 * 为用户绑定角色
	 * @url admin/system/user/sys/bindRole 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} user_id 		用户id
	 * @param {Array} roleList 		角色Id（role_id）列表
	 * @param {Boolean} reset 			是否直接覆盖用户角色，true：直接将roleList设置为用户角色，false：在用户已有角色后追加角色
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始----------------------------------------------------------- 
		let { user_id, roleList, reset } = data;
		res = uniID.bindRole({
			uid: user_id,
			roleList,
			reset
		});
		res.msg = res.message;
		return res;
	}

}
