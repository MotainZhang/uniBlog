module.exports = {
	/**
	 * 删除权限
	 * @url admin/system/permission/sys/delete 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} permission_id 			权限Id，唯一标识
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
		let { permission_id } = data;
		if (vk.pubfn.isNullOne(permission_id)) {
			return { code: -1, msg: 'permission_id不能为空' };
		}
		let dbName = "uni-id-permissions";
		// 检查是否有子项
		let num = await vk.baseDao.count({
			dbName,
			whereJson: {
				parent_id: permission_id
			}
		});
		if (num > 0) {
			return { code: -1, msg: '该项含有子项，请先删除子项！' };
		}
		res = uniID.deletePermission({
			permissionID: permission_id
		});
		res.msg = res.message;
		return res;
	}

}
