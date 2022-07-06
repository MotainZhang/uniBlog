module.exports = {
	/**
	 * 为角色绑定权限
	 * @url admin/system/role/sys/bindPermission 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Array} role_id 					角色Id（role_id）
	 * @param {Array} permissionList 	权限Id（permission_id）列表
	 * @param {Boolean} reset 					是否直接覆盖角色权限，true：直接将permissionList设置为角色权限，false：在角色已有权限后追加权限
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
		let { role_id, permissionList, reset, stats_count_info = {} } = data;
		res = uniID.bindPermission({
			roleID: role_id,
			permissionList,
			reset
		});
		// 修改stats_count_info统计信息
		await vk.baseDao.update({
			dbName: "uni-id-roles",
			whereJson: {
				role_id,
			},
			dataJson: {
				stats_count_info: _.set(stats_count_info)
			}
		});
		res.msg = res.message;
		return res;
	}

}
