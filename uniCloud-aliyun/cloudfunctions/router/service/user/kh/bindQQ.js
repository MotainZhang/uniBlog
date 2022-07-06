module.exports = {
  /**
   * 绑定QQ
   * @url user/kh/bindQQ 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} code QQ登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus，默认uni-id会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		// 业务逻辑开始-----------------------------------------------------------
		let { data = {}, userInfo, util } = event;
		let { uniID, vk, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 绑定
		res = await uniID.bindQQ(event.data);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
