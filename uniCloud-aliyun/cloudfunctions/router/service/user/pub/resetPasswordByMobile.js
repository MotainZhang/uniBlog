module.exports = {
	/**
	 * 根据手机+验证码重置密码
	 * @url user/pub/resetPasswordByMobile 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} password 重置后的密码
	 * @param {String} code 验证码
	 * @param {String} mobile 手机号
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { 
			_id,
			password,
			code,
			mobile
		} = data;
		let res = { code : -1, msg : '' };
		// 业务逻辑开始----------------------------------------------------------- 
		// 可写与数据库的交互逻辑等等
		// 检查验证码是否正确
		res = await uniID.verifyCode({
			mobile,
			code,
			type: 'reset'
		});
		if(res.code !== 0){
			return res;
		}
		// 根据mobile查询用户是否存在
		let userInfo = await vk.baseDao.findByWhereJson({
			dbName:"uni-id-users",
			whereJson:{
				mobile
			}
		});
		if(!userInfo){
			return { code : -1, msg : '手机号未注册!' };
		}
		// 重置密码
		res = await uniID.resetPwd({
			uid: userInfo._id,
			password
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}