module.exports = {
	/**
	 * 换绑新的邮箱
	 * @url user/kh/bindNewEmail 前端调用的url参数地址
	 * @description 将当前登录用户换绑新的邮箱
	 * data 请求参数 说明
	 * @param {String} oldEmail 旧邮箱码
	 * @param {String} oldEmailCode 旧邮箱收到的验证码
	 * @param {String} email 新邮箱码
	 * @param {String} code 新邮箱收到的验证码
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
			oldEmail, // 旧邮箱码
			oldEmailCode, // 旧邮箱收到的验证码
			email, // 新邮箱码
			code, // 新邮箱收到的验证码
		} = data;
		if (!code || !oldEmailCode) return { code: -1, msg: "验证码不能为空！" };
		if (!email || !oldEmail) return { code: -1, msg: "邮箱不能为空！" };
		// 先检查下旧邮箱码和验证码是否正确
		let verifyCodeRes;
		verifyCodeRes = await uniID.verifyCode({
			email: oldEmail,
			code: oldEmailCode,
			type: 'unbind'
		});
		if (verifyCodeRes.code !== 0) {
			verifyCodeRes.msg = `旧邮箱${verifyCodeRes.msg}`
			return verifyCodeRes;
		}
		// 先检查下新邮箱码和验证码是否正确
		verifyCodeRes = await uniID.verifyCode({
			email,
			code: code,
			type: 'bind'
		});
		if (verifyCodeRes.code !== 0) {
			verifyCodeRes.msg = `新邮箱${verifyCodeRes.msg}`
			return verifyCodeRes;
		}
		// 解绑邮箱
		let unbindEmailRes = await uniID.unbindEmail({
			uid,
			email: oldEmail
		});
		if (unbindEmailRes.code !== 0) {
			return unbindEmailRes;
		}
		await uniID.setVerifyCode({ code, email, type: "bind" });
		// 绑定新邮箱
		res = await uniID.bindEmail({
			uid,
			email,
			code
		});
		if (res.code !== 0) {
			return res;
		}
		res.msg = "换绑邮箱成功！";
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
