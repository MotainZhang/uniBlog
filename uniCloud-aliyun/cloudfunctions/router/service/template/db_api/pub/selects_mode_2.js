module.exports = {
	/**
	 * 多表查询(支持多张表连接查询)(VK2.0版本)
	 * @url template/db_api/pub/selects_mode_2 前端调用的url参数地址
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
		/**
		 * 此为简化版
		 * 此版本支持无限张表和主表进行连接
		 */
		res = await vk.baseDao.selects({
			dbName:"opendb-mall-comments",
			// 副表列表
			foreignDB:[
				{
					dbName:"opendb-mall-goods",
					localKey:"goods_id",
					foreignKey:"_id",
					as:"goodsInfo",
					limit:1
				},
				{
					dbName:"uni-id-users",
					localKey:"user_id",
					foreignKey:"_id",
					as:"userInfo",
					limit:1
				}
			]
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
