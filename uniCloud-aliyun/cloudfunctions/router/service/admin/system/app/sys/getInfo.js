'use strict';
module.exports = {
	/**
	 * 根据id获取信息
	 * @url admin/system/app/sys/getInfo 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let { appid } = data;
		let dbName = "opendb-app-list";
		res.info = await vk.baseDao.findByWhereJson({
			dbName,
			whereJson:{
				appid
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
