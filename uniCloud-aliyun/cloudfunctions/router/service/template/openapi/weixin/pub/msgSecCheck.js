'use strict';
module.exports = {
	/**
	 * 文本违规检测示例
	 * @url template/openapi/weixin/pub/msgSecCheck 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util } = event;
		let { config, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		let { content } = data;
		// 实际业务中，content可能是评论的内容等
		let msgSecCheckRes = await vk.openapi.weixin.security.msgSecCheck({
			content
		});
		if(msgSecCheckRes.code !== 0){
			// 未通过检测
			return msgSecCheckRes;
		}
		// 若通过检测，则继续执行自己的业务
		// ...
		// ...

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
