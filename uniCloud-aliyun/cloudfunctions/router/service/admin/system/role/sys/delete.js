module.exports = {
	/**
	 * 删除角色
	 * @url admin/system/role/sys/delete 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} role_id 			角色Id（role_id）
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
		let { role_id } = data;
		if (vk.pubfn.isNullOne(role_id)) {
			return { code: -1, msg: 'role_id不能为空' };
		}
		res = uniID.deleteRole({
			roleID: role_id
		});
		res.msg = res.message;
		return res;
	}

}
