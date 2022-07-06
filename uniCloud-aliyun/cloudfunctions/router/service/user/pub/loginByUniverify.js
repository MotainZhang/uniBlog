module.exports = {
	/**
	 * APP端 手机一键登录
	 * @url user/pub/loginByUniverify 前端调用的url参数地址
	 * @param {String} access_token 			uni.login登录成功后，返回的access_token参数
	 * @param {String} openid 						uni.login登录成功后，返回的openid参数
	 * @param {String} type 							指定操作类型，可选值为login、register，不传此参数时表现为手机号已注册则登录，手机号未注册则进行注册
	 * @param {String} password 					密码，type为register时生效
	 * @param {String} inviteCode 				邀请人的邀请码，type为register时生效
	 * @param {String} myInviteCode 			设置当前注册用户自己的邀请码，type为register时生效
	 * @param {Boolean} needPermission 	设置为true时会在checkToken时返回用户权限（permission），建议在管理控制台中使用
	 * res 返回参数说明
	 * @param {Number} code			错误码，0表示成功
	 * @param {String} msg				详细信息
	 * @param {String} uid 			当前token对应的用户uid
	 * @param {String} type			操作类型，login为登录、register为注册
	 * @param {String} mobile		登录者手机号
	 * @param {String} userInfo	用户全部信息
	 * @param {String} token			登录成功之后返回的token信息
	 * @param {String} tokenExpired		token过期时间
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		res = await uniID.loginByUniverify(data);
		if (res.token) {
			if (!res.msg) {
				res.msg = res.type === "register" ? "注册成功" : "登录成功";
			}
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "univerify",
				user_id: res.uid,
				context: originalParam.context
			}, util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
