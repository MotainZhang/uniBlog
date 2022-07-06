module.exports = {
	/**
	 * 换绑新的手机号
	 * @url user/kh/bindNewMobile 前端调用的url参数地址
	 * @description 将当前登录用户换绑新的手机号
	 * data 请求参数 说明
	 * @param {String} oldMobile 旧手机号码
	 * @param {String} oldMobileCode 旧手机收到的验证码
	 * @param {String} mobile 新手机号码
	 * @param {String} code 新手机收到的验证码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, util } = event;
		let { uniID } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		let {
			oldMobile, // 旧手机号码
			oldMobileCode, // 旧手机收到的验证码
			mobile, // 新手机号码
			code, // 新手机收到的验证码
		} = data;
		if (!code || !oldMobileCode) return { code: -1, msg: "验证码不能为空！" };
		if (!mobile || !oldMobile) return { code: -1, msg: "手机号不能为空！" };
		// 先检查下旧手机号码和验证码是否正确
		let verifyCodeRes;
		verifyCodeRes = await uniID.verifyCode({
			mobile: oldMobile,
			code: oldMobileCode,
			type: 'unbind'
		});
		if (verifyCodeRes.code !== 0) {
			verifyCodeRes.msg = `旧手机${verifyCodeRes.msg}`
			return verifyCodeRes;
		}
		// 先检查下新手机号码和验证码是否正确
		verifyCodeRes = await uniID.verifyCode({
			mobile,
			code: code,
			type: 'bind'
		});
		if (verifyCodeRes.code !== 0) {
			verifyCodeRes.msg = `新手机${verifyCodeRes.msg}`
			return verifyCodeRes;
		}
		// 解绑手机号
		let unbindMobileRes = await uniID.unbindMobile({
			uid,
			mobile: oldMobile
		});
		if (unbindMobileRes.code !== 0) {
			return unbindMobileRes;
		}
		// 绑定新手机号
		res = await uniID.bindMobile({
			uid,
			mobile
		});
		if (res.code !== 0) {
			return res;
		}
		res.msg = "换绑手机号成功！";
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
