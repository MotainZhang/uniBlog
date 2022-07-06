const formRules = require("../util/formRules.js");
module.exports = {
  /**
   * 批量新增
   * @url admin/system/menu/sys/adds 前端调用的url参数地址
   * data 请求参数 说明
	 * @param {Number} mode 					模式 1 :覆盖 2:忽略
	 * @param {Array<Object>} menus 	菜单json
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
			mode, 
			menus, 
		} = data;
		
		// 参数合法校验开始-----------------------------------------------------------
		let formRulesRes = await formRules.adds(event);
		if(formRulesRes.code !== 0){
			return formRulesRes;
		}
		// 参数合法校验结束-----------------------------------------------------------
		let dataArr = [];
		for(let i=0;i<menus.length;i++){
			let {
				menu_id, 
				name,
				comment,
				url,
				icon,
				sort = 0,
				parent_id,
				enable = true
			} = menus[i];
			
			dataArr.push({
				menu_id,
				name,
				comment,
				url,
				icon,
				sort,
				parent_id,
				enable
			});
		}
		if(mode == 1){
			// 如果是覆盖，则先删除原先的数据
			let menuIds = vk.pubfn.arrayObjectGetArray(dataArr, "menu_id");
			await vk.baseDao.del({
				dbName:"opendb-admin-menus",
				whereJson:{
					menu_id : _.in(menuIds)
				}
			});
		}
		// 执行数据库API请求
		await vk.baseDao.adds({
			dbName:"opendb-admin-menus",
			dataJson:dataArr
		});
    return res;
  }

}