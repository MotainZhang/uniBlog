'use strict';
module.exports = {
	/**
	 * 此函数名称
	 * @url user/pub/test1 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let {
			data = {}, userInfo, util, filterResponse, originalParam
		} = event;
		let {
			customUtil,
			config,
			pubFun,
			vk,
			db,
			_
		} = util;
		let {
			uid
		} = data;
		let res = {
			code: 0,
			msg: ""
		};
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等
		res = await vk.baseDao.selects({
			dbName: "blog-article-tag",
			pageSize: -1,
			groupJson: {
				_id: "$name",
				count: _.$.sum(1)
			},
			sortArr: [{ "name": "count","type": "desc" }],
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
