const formRules = require("../util/formRules.js");
module.exports = {
	/**
	 * 修改权限
	 * @url admin/system/permission/sys/update 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} permission_id 		权限Id，唯一标识
	 * @param {String} permission_name 	权限名称，展示用
	 * @param {String} comment 					备注
	 * @param {String} url 							云函数路径
	 * @param {String} icon 							图标
	 * @param {Number} sort 							排序(越大越在前面)
	 * @param {String} parent_id 				父级id
	 * @param {Boolean} enable 					是否启用
	 * @param {Number} match_mode 			0:完整路径 1:通配符 2:正则表达式
	 * @param {Number} curd_category 		0:未分类 1:增 2:删 3:改 4:查 5:特殊
	 * @param {Number} level 						0:未分类 1:子弹级 2:炸弹级 3:榴弹级 4:核弹级
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
			permission_id,
			permission_name,
			comment,
			url,
			icon,
			sort = 0,
			parent_id,
			enable = true,
			match_mode = 0,
			curd_category,
			level
		} = data;
		// 参数合法校验开始-----------------------------------------------------------
		let formRulesRes = await formRules.update(event);
		if (formRulesRes.code !== 0) {
			return formRulesRes;
		}
		// 参数合法校验结束-----------------------------------------------------------
		let dbName = "uni-id-permissions";
		let dataJson = {
			permission_name,
			comment,
			url,
			icon,
			sort,
			parent_id,
			enable,
			match_mode,
			curd_category,
			level
		};
		// 检测parent_id是否不存在
		if (vk.pubfn.isNotNull(parent_id)) {
			let num = await vk.baseDao.count({
				dbName,
				whereJson: {
					permission_id: parent_id
				}
			});
			if (num <= 0) {
				return { code: -1, msg: `父标识【${parent_id}】不存在!` };
			}
			let info = await vk.baseDao.findByWhereJson({
				dbName,
				whereJson: {
					permission_id
				}
			});
			if (vk.pubfn.isNotNull(info) && info.permission_id === parent_id) {
				return { code: -1, msg: `不可以设置自己为父级` };
			}
		} else {
			dataJson["parent_id"] = _.remove();
		}
		if (url === "" || JSON.stringify(url) === '[""]') {
			dataJson["url"] = _.remove();
		}
		// 执行数据库API请求
		res.num = await vk.baseDao.update({
			dbName,
			whereJson: {
				permission_id
			},
			dataJson
		});
		return res;
	}

}
