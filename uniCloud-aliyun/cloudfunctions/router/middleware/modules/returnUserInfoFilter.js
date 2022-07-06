/**
 * 返回用户信息
 * 由于通常前端需要对用户信息、登录token进行缓存
 * 故云函数对用户进行修改后，需要返回给前端最新的用户信息，以便前端始终能够缓存最新用户信息
 */

module.exports = [{
	id: "returnUserInfo",
	regExp: [
		"^user/pub/login(.*)",
		"^user/pub/register(.*)",
		"^user/kh/bind(.*)",
		"^user/kh/unbind(.*)",
		"^user/kh/update(.*)",
		"^user/kh/set(.*)",
		"^user/kh/acceptInvite$",
		"^client/user/pub/register(.*)",
		"^client/user/pub/login(.*)"
	],
	description: "用于指定哪些云函数请求后需要通知前端更新userInfo、token、tokenExpired",
	index: 310,
	mode: "onActionExecuted", // 可选 onActionExecuting onActionExecuted
	enable: true, // 通过设置enable=false可以关闭该中间件
	main: async function(event, serviceRes) {
		let { data = {}, uniIdToken, util, filterResponse, originalParam } = event;
		let { uniID, config = {}, vk, db, _ } = util;
		let { userInfo = {} } = filterResponse;
		let res = serviceRes;
		if (res.code === 0) {
			if (vk.pubfn.isNull(res.userInfo)) {
				if (vk.pubfn.isNotNull(res.uid)) {
					res.userInfo = await vk.daoCenter.userDao.findById(res.uid);
				} else if (vk.pubfn.isNotNull(uniIdToken)) {
					let tokenRes = await uniID.checkToken(uniIdToken);
					if (tokenRes.code === 0) {
						res.userInfo = tokenRes.userInfo;
					}
				}
			}
			if (vk.pubfn.isNotNull(res.userInfo)) {
				if (res.type === "login") {
					// 如果是登录
					// 判断用户当前 token数量 是否超过了最大限制 若 tokenMaxLimit 设置为0，代表不限制
					let tokenMaxLimit = config.uni && config.uni.tokenMaxLimit;
					if (tokenMaxLimit > 0) {
						let newUserInfo = await vk.baseDao.findById({
							dbName: "uni-id-users",
							id: res.userInfo._id,
							fieldJson: { token: true }
						});
						let token = newUserInfo.token || [];
						if (token.length > tokenMaxLimit) {
							// 淘汰旧的 token
							token = token.splice(tokenMaxLimit * -1);
							await vk.baseDao.updateById({
								dbName: "uni-id-users",
								id: res.userInfo._id,
								dataJson: {
									token: _.set(token)
								}
							});
						}
					}
				}
				res.needUpdateUserInfo = true;
				// 此处可以继续去除你不想返回给前端的字段
				let deleteKeys = ["token", "password"];
				res.userInfo = vk.pubfn.deleteObjectKeys(res.userInfo, deleteKeys);
			}
			if (vk.pubfn.isNotNullAll(res.token, res.tokenExpired)) {
				// 当返回vk_uni_token对象后，框架会让token自动被前端缓存，前端不需要手动再保存token至本地缓存了。
				res.vk_uni_token = {
					token: res.token,
					tokenExpired: res.tokenExpired
				};
			}
		}
		return res;
	}
}]
