'use strict';
module.exports = {
	/**
	 * 图片违规检测示例
	 * @url template/openapi/weixin/pub/imgSecCheck 前端调用的url参数地址
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
		let { base64 } = data;
		/**
		 * 实际开发中，图片可能是多张图，比如多达9张图
		 * 如果在一个请求中循环检测，可能会超时。
		 * 方案1：前端选择完图片就自动一张一张检测和上传（即9张图会有9个请求）
		 * 方案2：使用Promise.all
		 * 特别注意：目前微信小程序的这个API有1M大小的限制。（此为微信官方限制）
		 */
		let imgSecCheckRes = await vk.openapi.weixin.security.imgSecCheck({
			base64
		});
		if(imgSecCheckRes.code !== 0){
			// 未通过检测
			return imgSecCheckRes;
		}
		// 若通过检测，则继续执行自己的业务
		// ...
		// ...

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
