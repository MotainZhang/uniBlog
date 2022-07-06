module.exports = {
	/**
	 * 添加登录日志
	 * @param {Object} type            日志类型 login logout
	 * @param {String} login_type      登录类型 phone password weixin alipay
	 * @param {Object} user_id         用户ID
	 * @param {String} ip              ip地址
	 * @param {String} ua              userAgent
	 * @param {String} os              操作系统
	 * @param {String} platform        平台信息
	 * @param {Object} context         请求上下文
	 * @param {Number} state           1:登录成功 0 登录失败
	 */
	add: async (event, util) => {
		let { uniID, config, pubFun, vk, db, _ } = util;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			type,
			login_type,
			user_id,
			ip,
			ua,
			os,
			platform,
			context = {},
			state = 1,
			dcloud_appid
		} = event;
		if (context) {
			ip = context.CLIENTIP;
			ua = context.CLIENTUA;
			os = context.OS;
			platform = context.PLATFORM;
			dcloud_appid = context.APPID;
		}
		try {
			if (vk.pubfn.getData(config, "vk.service.log.login.status")) {
				let nowDate = new Date();
				let {
					now
				} = vk.pubfn.getCommonTime(nowDate);
				// 增加登录日志
				await vk.baseDao.add({
					dbName: "uni-id-log",
					dataJson: {
						type,
						login_type,
						user_id,
						ip,
						ua,
						os,
						platform,
						state,
						dcloud_appid,
						date:{
							...now,
							date_day_str: vk.pubfn.timeFormat(nowDate, "yyyy-MM-dd"),
							date_month_str: vk.pubfn.timeFormat(nowDate, "yyyy-MM")
						}
					}
				});
			} else {
				console.log("已关闭登录日志");
			}
		} catch (err) {
			console.log("日志写入错误");
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
