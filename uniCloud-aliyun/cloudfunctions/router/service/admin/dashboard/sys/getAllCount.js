module.exports = {
	/**
	 * 查询多条记录 分页
	 * @url admin/kong/sys/getList 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Number}         pageIndex 当前页码
	 * @param {Number}         pageSize  每页显示数量
	 * @param {Array<Object>}  sortRule  排序规则
	 * @param {object}         formData  查询条件数据源
	 * @param {Array<Object>}  columns   查询条件规则
	 * res 返回参数说明
	 * @param {Number}         code      错误码，0表示成功
	 * @param {String}         msg       详细信息
	 */
	main: async (event) => {
		let {
			data = {}, userInfo, util, filterResponse, originalParam
		} = event;
		let {
			customUtil,
			uniID,
			config,
			pubFun,
			vk,
			db,
			_
		} = util;
		let {
			uid,
		} = data;
		let res = {
			code: 0,
			msg: ''
		};
		// 业务逻辑开始-----------------------------------------------------------
		let articleCount = await vk.baseDao.count({
			dbName: 'blog-article',
		});
		let categoryCount = await vk.baseDao.count({
			dbName: "blog-article-category",
			groupJson: {
				_id: "$name",
			},
		});
		let tagCount = await vk.baseDao.count({
			dbName: "blog-article-tag",
			groupJson: {
				_id: "$name",
			},
		});
		let friendCount = await vk.baseDao.count({
			dbName: "blog-friend",
		});
		res.articleCount = articleCount
		res.categoryCount = categoryCount
		res.tagCount = tagCount
		res.friendCount = friendCount
		return res;
	}

}
