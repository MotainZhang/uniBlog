module.exports = {
	/**
	 * 删除
	 * @url admin/system_uni/components-dynamic/sys/delete 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} _id 		id
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { _id } = data;
		// 参数非空检测
		if(vk.pubfn.isNullOne(_id)){
			return { code : -1, msg : '_id不能为空' };
		}
		// 执行数据库API请求
		let num = await vk.baseDao.del({
		dbName:"vk-components-dynamic",
			whereJson:{
				_id
			}
		});
		return res;
	}

}
