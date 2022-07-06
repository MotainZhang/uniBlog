module.exports = {
	/**
	 * 为角色绑定菜单
	 * @url admin/system/role/sys/bindMenu 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Array} role_id 					角色Id（role_id）
	 * @param {Array} menuList 				菜单Id（menu_id）列表
	 * @param {Boolean} reset 					是否直接覆盖菜单，true：直接将menuList设置为角色菜单，false：在角色已有菜单后追加菜单
	 * @param {Boolean} addPermission	是否自动添加菜单内置的权限 默认false
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
		let { role_id, menuList, reset, addPermission } = data;
		res = await vk.system.sysDao.roleBindMenu({
			role_id,
			menuList,
			reset,
			addPermission
		});
		let dbName = "uni-id-roles";
		let roleInfo = await vk.baseDao.findByWhereJson({
			dbName,
			whereJson: {
				role_id,
			}
		});
		let count = roleInfo.menu ? roleInfo.menu.length : 0;
		// 修改stats_count_info统计信息
		await vk.baseDao.update({
			dbName,
			whereJson: {
				role_id,
			},
			dataJson: {
				["stats_count_info.type.0.count"] : count
			}
		});
		return res;
	}

}
