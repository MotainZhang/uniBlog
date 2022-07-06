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
		// 查询articeID对应的评论
		res = await vk.baseDao.selects({
			dbName: "blog-article-comment", // 主表名
			getCount: false, // 是否需要同时查询满足条件的记录总数量，默认false
			getMain: false, // 是否只返回rows数据，默认false
			// pageSize： - 1,
			// 主表字段显示规则
			fieldJson: {},
			whereJson:{
				articleId:data.articleId
			},
			// 主表排序规则
			sortArr: [{
				"name": "_add_time",
				"type": "desc"
			}],
			// 副表列表
			foreignDB: [{
					dbName: "uni-id-users",
					localKey: "user_id",
					foreignKey: "uid",
					as: "user",
					limit: 1,
					fieldJson: {
						token: false,
						password: false,
					},
				},
				{
					dbName: "blog-comment-reply", // 副表名
					localKey: "_id", // 主表外键字段名
					foreignKey: "commentId", // 副表外键字段名
					as: "replies",
					// 副表字段显示规则
					fieldJson: {},
					// 副表排序规则
					sortArr: [{
						"name": "_add_time",
						"type": "desc"
					}],
					foreignDB: [{
						dbName: "uni-id-users",
						localKey: "user_id",
						foreignKey: "uid",
						as: "user",
						limit: 1,
						fieldJson: {
							token: false,
							password: false,
						},
					}, ]
				},
			]
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
