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
			articleId,
			tag,
			category,
			sortRule
		} = data;
		let dbName = "blog-article";
		let fieldJson = {};
		let whereJson = {};
		let lastWhereJson = {};
		let sortArr = [];
		// 排序规则开始-----------------------------------------------------------
		sortArr.push({
			"name": "_add_time",
			"type": "desc"
		});
		if (sortRule) sortArr = sortRule;
		// 排序规则结束-----------------------------------------------------------
		// 查询条件开始-----------------------------------------------------------
		if (searchvalue) {
			// 查询searchvalue开头的数据
			try {
				// 如果查询需要用到正则，建议将正则用try catch 包起来。
				whereJson["title"] = new RegExp('^' + searchvalue);
			} catch (err) {
				return {
					code: -1,
					msg: '请输入合法的查询内容'
				};
			}
		}
		// 这里可以写必须满足的查询条件，如whereJson["user_id"] = uid;代表只查自己的记录
		if (articleId) {
			whereJson["_id"] = articleId
			// viewcount加1,查询一次详情查看次数加1
			let info = await vk.baseDao.findById({
				id: articleId,
				dbName: dbName,
			});
			await vk.baseDao.updateById({
				dbName,
				id: articleId,
				dataJson: {
					viewCount: Number(info.viewCount) + 1
				}
			});
		};
		if (tag) lastWhereJson["tags.name"] = tag;
		if (category) lastWhereJson["category.name"] = category;
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
					dbName: "blog-article-tag", // 副表名
					localKey: "_id", // 主表外键字段名
					foreignKey: "articleId", // 副表外键字段名
					as: "tags",
					// 副表字段显示规则
					fieldJson: {},
				},
				{
					dbName: "blog-article-category", // 副表名
					localKey: "_id", // 主表外键字段名
					foreignKey: "articleId", // 副表外键字段名
					as: "categories",
				},
				{
					dbName: "blog-comment", // 副表名
					localKey: "_id", // 主表外键字段名
					foreignKey: "articleId", // 副表外键字段名
					as: "comments",
				},

			],
			lastWhereJson: lastWhereJson
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}

}
