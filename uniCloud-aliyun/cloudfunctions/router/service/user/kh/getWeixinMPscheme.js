'use strict';
module.exports = {
  /**
   * 获取小程序scheme码，适用于短信、邮件、外部网页等拉起小程序的业务场景。通过该接口，可以选择生成到期失效和永久有效的小程序码，目前仅针对国内非个人主体的小程序开放
   * @url user/kh/getWeixinMPscheme 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} path    小程序页面路径
	 * @param {String} query   小程序页面参数
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   */
  main: async (event) => {
    let { data = {}, userInfo, util, originalParam } = event;
    let { uniID, pubFun, vk , db, _ } = util;
    let { uid } = data;
    let res = { code : 0, msg : '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { 
			path,
			query
		} = data;
    res = await vk.openapi.weixin.urlscheme.generate({
			// 跳转到的目标小程序信息。
			jump_wxa:{
				path,				// 小程序页面路径
				query				// 小程序页面参数
			},
			// 生成的scheme码类型，到期失效：true，永久有效：false。
			is_expire:true,
			// 到期失效的scheme码的失效时间，单位秒。最长有效期为1年。
			expire_time: 3600*24*30
		});
		return res;
    // 业务逻辑结束-----------------------------------------------------------
  }
}
