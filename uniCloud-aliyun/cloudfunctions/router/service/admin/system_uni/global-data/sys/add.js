const formRules = require('../util/formRules.js');
module.exports = {
	/**
	 * 添加
	 * @url admin/system_uni/global-data/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} key 			键名
	 * @param {不限制} value 			键值
	 * @param {不限制} comment 		备注
	 * res 返回参数说明
	 * @param {Number} code			错误码，0表示成功
	 * @param {String} msg				详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { 
			key,
			value,
			comment
		} = data;
		// 参数合法校验
		let formRulesRes = await formRules.add(event);
		if(formRulesRes.code !== 0){
			return formRulesRes;
		}
		
		let dbName = "vk-global-data";
		// 检测key是否已存在
		let num = await vk.baseDao.count({
			dbName:dbName,
			whereJson:{
				key,
			}
		});
		if(num > 0){
			return { code : -1, msg : `键值【${key}】不能重复!` };
		}
		// 执行数据库API请求
		res.id = await vk.baseDao.add({
			dbName:dbName,
			dataJson:{
				key,
				value,
				comment
			}
		});
		return res;
	}

}
