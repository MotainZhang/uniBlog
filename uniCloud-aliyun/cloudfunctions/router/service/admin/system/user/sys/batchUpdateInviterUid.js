module.exports = {
	/**
	 * 修改用户推荐人
	 * @url admin/system/user/sys/batchUpdateInviterUid 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} user_id 		用户ID
	 * @param {String} parent_id 修改成的用户推荐人邀请码
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
		let { user_id, parent_id } = data;
		// 参数非空检测
		if (vk.pubfn.isNullOne(user_id)) {
			return { code: -1, msg: '参数错误' };
		}
		let parentUser = await vk.baseDao.findById({
			dbName: "uni-id-users",
			id: parent_id,
		});
		if (vk.pubfn.isNull(parentUser)) {
			return { code: -1, msg: '父标识对应的用户不存在！' };
		}
		let { my_invite_code } = parentUser;
		if (vk.pubfn.isNull(my_invite_code)) {
			return { code: -1, msg: '父标识对应的用户无邀请码，无法邀请！' };
		}
		// 执行数据库API请求
		res = await uniID.acceptInvite({
			uid: user_id,
			inviteCode: my_invite_code
		});
		res.msg = res.message;
		return res;
	}
}
