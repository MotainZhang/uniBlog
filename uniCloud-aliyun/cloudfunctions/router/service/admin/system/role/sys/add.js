const formRules = require("../util/formRules.js");
module.exports = {
	/**
	 * 新增角色
	 * @url admin/system/role/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} role_id 			角色Id（role_id）
	 * @param {String} role_name 		角色名称，展示用
	 * @param {String} comment 			备注
	 * @param {Boolean} enable 			是否启用
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
			role_id,
			role_name,
			comment,
			enable = true,
		} = data;

		// 参数合法校验开始-----------------------------------------------------------
		let formRulesRes = await formRules.add(event);
		if (formRulesRes.code !== 0) {
			return formRulesRes;
		}
		// 参数合法校验结束-----------------------------------------------------------
		let dbName = "uni-id-roles";
		// 检查role_id是否存在
		let num = await vk.baseDao.count({
			dbName,
			whereJson: {
				role_id
			}
		});
		if (num > 0) {
			return { code: -1, msg: `标识【${role_id}】不能重复!` };
		}
		// 执行数据库API请求
		res.id = await vk.baseDao.add({
			dbName,
			dataJson: {
				role_id,
				role_name,
				comment,
				enable
			}
		});
		return res;
	}

}
