'use strict';
module.exports = {
	/**
	 * 获取我拥有的菜单列表
	 * @url user/kh/getMenu 前端调用的url参数地址
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
			role = [],
		} = userInfo;
		// 根据角色获取菜单
		res = await vk.system.sysDao.listMenuByRole({
			role
		});
		res.userInfo = userInfo;
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
