module.exports = {
	/**
	 * 添加单条数据
	 * @url admin/kong/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
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
		let res = {
			code: 0,
			msg: 'ok'
		};
		// 业务逻辑开始-----------------------------------------------------------
		let articleId = data[0].articleId
		let dbName = "blog-article-tag";
		await vk.baseDao.del({
			dbName,
			whereJson: {
				articleId: articleId
			}
		});
		res.id = await vk.baseDao.adds({
			dbName,
			cancelAddTime: true,
			dataJson: data
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
