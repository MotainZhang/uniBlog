module.exports = {
  /**
   * 用户注册(账号+密码)
   * @url user/pub/register 前端调用的url参数地址
   * @description 用户注册(账号+密码)
	 * data 请求参数 说明
	 * @param {String} username 用户名，唯一
	 * @param {String} password 密码
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 注册完成自动登录之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
   */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : -1, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { username, password, needPermission } = data;
		// username必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线
		if(!vk.pubfn.test(username,"username")){
			return { code : -1, msg : "账号必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线" };
		}
		// password 长度在6~18之间，只能包含字母、数字和下划线
		if(!vk.pubfn.test(password,"pwd")){
			return { code : -1, msg : "密码长度在6~18之间，只能包含字母、数字和下划线" };
		}
		 res = await uniID.register({
			 username, password, needPermission
		 });
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
