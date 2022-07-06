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
		let commentId = await vk.baseDao.add({
			dbName: "blog-comment-reply",
			cancelAddTime: false, // 通过设置 cancelAddTime:true 可以取消 _add_time 字段的添加
			dataJson: data
		});
		res['commentId'] = commentId
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
