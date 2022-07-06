module.exports = {
	/**
	 * 修改权限等级
	 * @url admin/system/permission/sys/updateLevel 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} _id 						权限Id
	 * @param {Number} level 						0:未分类 1:子弹级 2:炸弹级 3:榴弹级 4:核弹级
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
			level=0,
		} = data;
		let dbName = "uni-id-permissions";
		// 执行数据库API请求
		res.num = await vk.baseDao.updateById({
			dbName,
			id:_id,
			dataJson:{
				level
			}
		});
		return res;
	}

}
