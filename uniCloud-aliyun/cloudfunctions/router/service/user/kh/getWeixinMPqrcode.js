'use strict';
module.exports = {
  /**
   * 获取小程序码
   * @url user/kh/getWeixinMPqrcode 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} scene        自定义参数最大32个可见字符 只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~
	 * @param {String} page         必须是已经发布的小程序存在的页面（否则报错），例如 pages/index/index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
	 * @param {number} width        二维码的宽度，单位 px，最小 280px，最大 1280px
	 * @param {boolean} auto_color  自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false
	 * @param {Object} line_color   auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
	 * @param {boolean} is_hyaline  是否需要透明底色，为 true 时，生成透明底色的小程序
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   */
  main: async (event) => {
    let { data = {}, userInfo, util, originalParam } = event;
    let { uniID, config, pubFun, vk , db, _ } = util;
    let { uid } = data;
    let res = { code : 0, msg : '' };
    // 业务逻辑开始-----------------------------------------------------------
		let { my_invite_code } = userInfo;
		if(vk.pubfn.isNull(data.scene) && my_invite_code){
			// 若scene为空,则自动带上用户邀请码
			data.scene = `code=${my_invite_code}`;
		}
    res = await vk.openapi.weixin.wxacode.getUnlimited(data);
		if(typeof res === "object" && res.code){
			return res;
		}
		try {
			// 二进制转base64
			let base64 = Buffer.from(res, 'binary').toString('base64')
			return {
				code:0,
				base64:`data:image/png;base64,${base64}`
			};
		}catch(err){
			// 转base64失败
			return {
				code:-1,
				msg:"生成小程序码失败",
				err: {
					message:err.message,
					stack:err.stack
				}
			};
		}
    // 业务逻辑结束-----------------------------------------------------------
  }
}
