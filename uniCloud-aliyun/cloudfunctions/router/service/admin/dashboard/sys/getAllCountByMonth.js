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
			monthTimeArr
		} = data;
		let res = {
			code: 0,
			msg: ''
		};
		// 业务逻辑开始-----------------------------------------------------------
		let articleArr = []
		let categoryArr = []
		let tagArr = []
	    for(let i =0;i< monthTimeArr.length;i++){
			let time = monthTimeArr[i]
			let articleCount = await vk.baseDao.count({
				dbName:"blog-article",
				whereJson: {
				   _add_time_str: new RegExp('^'+time)
				}
			});
			// 没有时间凑一下数
			let categotyCount = await vk.baseDao.count({
				dbName:"blog-article-category",
				whereJson: {
				   _add_time_str: new RegExp('^'+time)
				}
			});
			let tagCount = await vk.baseDao.count({
				dbName:"blog-article-tag",
				whereJson: {
				   _add_time_str: new RegExp('^'+time)
				}
			});
			articleArr.push(articleCount)
			categoryArr.push(categotyCount)
			tagArr.push(tagCount)
		}
		res.articleCountList = articleArr
		res.categoryCountList = categoryArr
		res.tagCountList = tagArr
		res.monthList = monthTimeArr
		return res;
	}

}
