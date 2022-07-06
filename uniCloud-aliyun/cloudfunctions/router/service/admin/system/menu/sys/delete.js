module.exports = {
  /**
   * 删除
   * @url admin/system/menu/sys/delete 前端调用的url参数地址
   * data 请求参数 说明
	 * @param {String} menu_id 			菜单Id，唯一标识
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
		let { menu_id } = data;
		if(vk.pubfn.isNullOne(menu_id)){
			return { code : -1, msg : 'menu_id不能为空' };
		}
		// 检查是否有子项
		let num = await vk.baseDao.count({
			dbName:"opendb-admin-menus",
			whereJson:{
				parent_id : menu_id
			}
		});
		if(num > 0){
			return { code : -1, msg : '该项含有子项，请先删除子项！' };
		}
		res.num = await vk.baseDao.del({
			dbName:"opendb-admin-menus",
			whereJson:{
				menu_id
			}
		});
    return res;
  }

}
