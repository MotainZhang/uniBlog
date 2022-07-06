'use strict';
module.exports = {
	/**
	 * 发送订阅消息
	 * @url template/openapi/weixin/pub/sendMessage 前端调用的url参数地址
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
		let { openid } = data;
		res = await vk.openapi.weixin.subscribeMessage.send({
			touser : openid,							// 接收者（用户）的 openid
			template_id : "UmINo5I6IcqktIwNt2TVorkU7f4dzd4eyNjfvOiwEC0",							// 所需下发的订阅模板id
			page : "pages/index/index",		// 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
			data : { 
				character_string1:{
					value:"202008030930001"
				},
				name2:{
					value:"中通快递"
				},
				character_string3:{
					value:"ZT2019928321392931"
				},
				thing6:{
					value:"雪花秀滋盈生人生焕颜精华露"
				},
				thing8:{
					value:"杭州市xxxxxxxxx号"
				}
			},
			miniprogram_state : "formal",	// 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
		});
		
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
