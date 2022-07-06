module.exports = {
	/**
	 * 数据删除
	 * @url template/db_api/pub/del 前端调用的url参数地址
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
		 * 这里为了防止误删,故vk.baseDao.del API
		 * 会判断如果whereJson为空,则不执行删除操作
		 * 所以这里加了个_id: _.exists(true)条件来达到删除全部的功能(实际开发时慎用删除全部功能)
		 */
		res.num = await vk.baseDao.del({
			dbName:"vk-test",
			whereJson:{
				_id: _.exists(true)
			}
		});
		// 对应的sql:
		// delete from vk-test where user_id != '___'
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}

}
