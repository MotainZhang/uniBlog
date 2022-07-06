module.exports = {
	/**
	 * 连表查询(仅限两表查询)(VK版本)
	 * @url template/db_api/pub/select2 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		// 业务逻辑开始----------------------------------------------------------- 
		// 想要两表以上的连接,请使用vk.baseDao.selects
		res = await vk.baseDao.selects({
			dbName:"uni-id-users",
			foreignKey:"_id",
			getCount:false,
			pageIndex:1,
			pageSize:10,
			// 主表where条件
			whereJson:{
				
			},
			// 主表字段显示规则
			fieldJson:{token:false, password:false},
			// 主表排序规则
			sortArr:[{"name":"_id", "type":"desc"}],
			// 副表列表
			foreignDB:[
				{
					dbName:"vk-test",
					foreignKey:"user_id",
					as:"testList",
					limit:1,
					// 副表where条件
					whereJson:{ },
					// 副表字段显示规则
					fieldJson:{ },
					// 副表排序规则
					sortArr:[{"name":"money", "type":"desc"}],
				}
			]
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}