module.exports = {
	/**
	 * 修改权限分类
	 * @url admin/system/permission/sys/updateCategory 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} _id 						权限Id
	 * @param {Number} curd_category 		0:未分类 1:增 2:删 3:改 4:查 5:特殊
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			_id,
			curd_category=0,
		} = data;
		let dbName = "uni-id-permissions";
		// 执行数据库API请求
		res.num = await vk.baseDao.updateById({
			dbName,
			id:_id,
			dataJson:{
				curd_category
			}
		});
		return res;
	}

}
