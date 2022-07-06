const formRules = require("../util/formRules.js");
module.exports = {
	/**
	 * 修改
	 * @url admin/system/menu/sys/update 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} menu_id 					菜单Id，唯一标识
	 * @param {String} name 							菜单名称
	 * @param {String} comment 					备注
	 * @param {String} url 							页面路径
	 * @param {String} icon 							菜单图标
	 * @param {Number} sort 							排序(越大越在前面)
	 * @param {String} parent_id 				父级id
	 * @param {Boolean} enable 					是否启用
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
		let {
			menu_id,
			name,
			comment,
			url,
			icon,
			sort = 0,
			parent_id,
			enable = true,
			hidden_menu
		} = data;
		// 参数合法校验开始-----------------------------------------------------------
		let formRulesRes = await formRules.update(event);
		if (formRulesRes.code !== 0) {
			return formRulesRes;
		}
		// 参数合法校验结束-----------------------------------------------------------
		let dbName = "opendb-admin-menus";
		let dataJson = {
			name,
			comment,
			url,
			icon,
			sort,
			parent_id,
			enable,
			hidden_menu
		};
		// 检测parent_id是否不存在
		if (vk.pubfn.isNotNull(parent_id)) {
			let num = await vk.baseDao.count({
				dbName,
				whereJson: {
					menu_id: parent_id
				}
			});
			if (num <= 0) {
				return { code: -1, msg: `父标识【${parent_id}】不存在!` };
			}
			let info = await vk.baseDao.findByWhereJson({
				dbName,
				whereJson: {
					menu_id
				}
			});
			if (vk.pubfn.isNotNull(info) && info.menu_id === parent_id) {
				return { code: -1, msg: `不可以设置自己为父菜单` };
			}
		} else {
			dataJson["parent_id"] = _.remove();
		}
		// 执行数据库API请求
		res.num = await vk.baseDao.update({
			dbName,
			whereJson: {
				menu_id
			},
			dataJson
		});
		return res;
	}

}
