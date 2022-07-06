module.exports = {
	/**
	 * 查询多条记录 分页
	 * @url template/db_api/pub/getList 前端调用的url参数地址
	 * data 请求参数 说明
	 * @params {String} tableName 	表名
	 * @params {String} addTime 		搜索开始时间
	 * @params {String} endTime 		搜索截止时间
	 * @params {String} searchvalue 搜索指定内容
	 * @params {Number} pageIndex 	当前页码
	 * @params {Number} pageSize 		每页显示数量
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let {
			data = {}, util, originalParam
		} = event;
		let {
			uniID,
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
			msg: ''
		};
		// 业务逻辑开始----------------------------------------------------------- 
		// 可写与数据库的交互逻辑等等
		let {
			pageIndex,
			pageSize,
			searchvalue,
			friendId,
			sortRule
		} = data;
		let dbName = "blog-friend";
		let fieldJson = {};
		let whereJson = {};
		let lastWhereJson = {};
		let sortArr = [];
		// 排序规则开始-----------------------------------------------------------
		sortArr.push({
			"name": "createdAt",
			"type": "desc"
		});
		if (sortRule) sortArr = sortRule;
		// 排序规则结束-----------------------------------------------------------
		// 查询条件开始-----------------------------------------------------------

		// 这里可以写必须满足的查询条件，如whereJson["user_id"] = uid;代表只查自己的记录
		if (friendId) whereJson["_id"] = friendId;
		// 查询条件结束-----------------------------------------------------------
		res = await vk.baseDao.selects({
			dbName: dbName,
			getCount: true,
			pageIndex: pageIndex,
			pageSize: pageSize,
			fieldJson: fieldJson,
			whereJson: whereJson,
			sortArr: sortArr,
			// 副表列表
			foreignDB: [{
					dbName: "blog-friend-like", // 副表名
					localKey: "_id", // 主表外键字段名
					foreignKey: "friendId", // 副表外键字段名
					as: "friendLikes",
				},
				{
					dbName: "blog-friend-reply", // 副表名
					localKey: "_id", // 主表外键字段名
					foreignKey: "friendId", // 副表外键字段名
					as: "friendReplies",
				},
				{
					dbName: "uni-id-users",
					localKey: "user_id",
					foreignKey: "uid",
					as: "user",
					limit: 1,
					fieldJson: {
						token: false,
						password: false,
					},
				}
			],
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}

}
