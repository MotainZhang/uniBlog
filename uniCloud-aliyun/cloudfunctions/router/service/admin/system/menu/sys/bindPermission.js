module.exports = {
  /**
   * 为菜单设置内置权限
	 * 角色拥有菜单后,将同时拥有菜单内的所有内置权限
   * @url admin/system/menu/sys/bindPermission 前端调用的url参数地址
   * data 请求参数 说明
	 * @param {String} menu_id 				菜单id（menu_id）
	 * @param {Array} permissionList 	权限Id（permission_id）列表
	 * @param {Boolean} reset 					是否直接覆盖权限，true：直接将permissionList设置为权限，false：在菜单已有权限后追加权限
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   */
  main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
    // 业务逻辑开始----------------------------------------------------------- 
		let { 
			menu_id,
			permissionList,
			reset
		} = data;
		res = await vk.system.sysDao.menuBindPermission({
			menu_id,
			permissionList,
			reset
		});
    return res;
  }

}