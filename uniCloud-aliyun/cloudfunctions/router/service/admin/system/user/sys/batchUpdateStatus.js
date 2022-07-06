module.exports = {
	/**
	 * 批量修改用户状态
	 * @url admin/system/user/sys/batchUpdateStatus 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Array} user_ids 		用户id数组
	 * @param {Integer} status 		修改成的用户状态：0 正常 1 禁用 2 审核中 3 审核拒绝
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
		let { user_ids, status } = data;
		// 参数非空检测
		if (vk.pubfn.isNullOne(user_ids, status)) {
			return { code: -1, msg: '参数错误' };
		}
		if (user_ids.indexOf(uid) > -1 && status === 1) {
			return { code: -1, msg: '不可禁用自己' };
		}
		// 执行数据库API请求
		res.num = await vk.baseDao.update({
			dbName: "uni-id-users",
			whereJson: {
				_id: _.in(user_ids)
			},
			dataJson: {
				status: status
			}
		});

		return res;
	}

}
