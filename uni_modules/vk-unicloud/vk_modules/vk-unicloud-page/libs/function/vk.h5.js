// #ifdef H5
/**
 * H5专用的一些函数，会涉及到window等H5专用的内置对象。
 */
var h5 = {};

// 引入 微信公众号 js_sdk 包
import wx from './weixin-js-sdk'
h5.wx = wx;

/**
 * 获取当前H5所在的环境
 * let env = vk.h5.getEnv();
 */
h5.getEnv = function() {
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger' && (ua.match(/miniprogram/i) == 'miniprogram')) {
		// 微信小程序
		return "mp-weixin";
	}
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		// 微信公众号
		return "h5-weixin";
	}
	if (ua.match(/alipay/i) == 'alipay' && ua.match(/miniprogram/i) == 'miniprogram') {
		return "mp-alipay";
	}
	if (ua.match(/alipay/i) == 'alipay') {
		return "h5-alipay";
	}
	// 外部 H5
	return "h5";
};

export default h5;
// #endif
