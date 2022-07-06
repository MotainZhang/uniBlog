const formRules = require("../util/formRules.js");
module.exports = {
	/**
	 * 添加用户
	 * @url admin/system/user/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} username 		用户名
	 * @param {String} nickname 		昵称
	 * @param {String} gender 			性别
	 * @param {Boolean} mobile 		手机号
	 * @param {String} comment 		备注
	 * @param {Array} dcloud_appid 	允许登录的应用列表
	 * @param {Number} login_appid_type 	0:全部应用 1:部分应用
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
			username,
			password,
			nickname,
			gender,
			mobile,
			email,
			comment,
			allow_login_background,
			dcloud_appid = [],
			login_appid_type
		} = data;
		if (!password) password = "234567";
		// 参数合法校验开始-----------------------------------------------------------
		let formRulesRes = await formRules.add(event);
		if (formRulesRes.code !== 0) {
			return formRulesRes;
		}
		// 参数合法校验结束-----------------------------------------------------------

		let dbName = "uni-id-users";
		// 检测username
		let num = await vk.baseDao.count({ dbName, whereJson: { username } });
		if (num > 0) return { code: -1, msg: `用户名【${username}】已注册!` };
		// 检测mobile
		if (mobile) {
			let num = await vk.baseDao.count({ dbName, whereJson: { mobile } });
			if (num > 0) return { code: -1, msg: `手机号【${mobile}】已注册!` };
		}
		// 检测email
		if (email) {
			let num = await vk.baseDao.count({ dbName, whereJson: { email } });
			if (num > 0) return { code: -1, msg: `邮箱【${email}】已注册!` };
		}
		if (typeof uniID.addUser !== "function") return { code: -1, msg: `请升级uni-id版本至3.3.14或以上。` };
		let addUserRes = await uniID.addUser({
			username,
			password,
			mobile,
			email,
			authorizedApp: dcloud_appid
		});
		if (addUserRes.code !== 0 || !addUserRes.uid) {
			return addUserRes;
		}
		// 用户其他信息
		let dataJson = {
			nickname,
			gender,
			comment,
			allow_login_background,
			status: 0,
		};
		// 如果设置允许登录所有应用，则直接删除dcloud_appid字段
		if (login_appid_type === 0) {
			dataJson["dcloud_appid"] = _.remove();
		}
		// 设置用户其他信息
		await vk.baseDao.update({
			dbName,
			whereJson: {
				_id: addUserRes.uid
			},
			dataJson
		});
		res.type = "register";
		res.uid = addUserRes.uid;
		return res;
	}
}
