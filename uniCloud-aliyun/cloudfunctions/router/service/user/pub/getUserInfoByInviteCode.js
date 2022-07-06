'use strict';
module.exports = {
	/**
	 * 根据邀请码获取用户社交信息
	 * @url user/pub/getUserInfoByInviteCode 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} code
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { code } = data;
		// 参数非空检测
		let nullKey = vk.pubfn.isNullOneByObject({ code });
		if(nullKey) return { code:-1, msg:'参数 '+nullKey+' 不能为空' };
		res.userInfo = await vk.baseDao.findByWhereJson({
			dbName:"uni-id-users",
			fieldJson:{ 
				_id:true,
				nickname:true,
				gender:true,
				avatar:true,
				my_invite_code:true,
				social_info:true
			},
			whereJson:{
				my_invite_code : code
			}
		});
		return res;
		// 业务逻辑结束-----------------------------------------------------------
	}
}
