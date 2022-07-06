module.exports = {
  /**
   * 获取我的用户信息
   * @url user/kh/getMyUserInfo 前端调用的url参数地址
   */
	main: async (event) => {
		// 业务逻辑开始-----------------------------------------------------------
		let { data = {}, userInfo, util } = event;
		let { uniID, vk, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		res.userInfo = userInfo;
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}