/**
 * 百度API
 */
var baidu = {};
var vk = {};
var baiduOpenApiAccessTokenCacheName = "vk_openapi_baidu_open_token";
baidu.init = function(util={}) {
	vk =  util.vk;
};

// 百度开放平台api
baidu.open = {};
// 文字识别
baidu.open.ocr = {};

/**
 * 营业执照识别
 * 以下data参数三选一即可
 * @param {File} file     文件对象
 * @param {String} image  图像base64编码后进行urlencode
 * @param {String} url    图片完整URL
 *
vk.openapi.baidu.open.ocr.business_license({
	title:"识别中...",
	data: {
		file: res.tempFiles[0]
	},
	success: (res) => {
		that.data = res.data;
	},
});
 */
baidu.open.ocr.business_license = function(obj={}){
	obj.action = "ocr/v1/business_license";
	let file = obj.data.file;
	if(file){
		vk.pubfn.fileToBase64({ file }).then(base64 => {
			obj.data.image = base64;
			delete obj.data.file;
			baidu.request(obj);
		});
	}else{
		baidu.request(obj);
	}
}

/**
 * 身份证识别
 * 以下data参数三选一即可
 * @param {File} file     文件对象
 * @param {String} image  图像base64编码后进行urlencode
 * @param {String} url    图片完整URL
vk.openapi.baidu.open.ocr.idcard({
	title:"识别中...",
	data: {
		image:base64,
		id_card_side:"front", // front：身份证含照片的一面 back：身份证带国徽的一面
	},
	success: (res) => {
		that.data = res.data;
	},
});
 */
baidu.open.ocr.idcard = function(obj={}){
	obj.action = "ocr/v1/idcard";
	let file = obj.data.file;
	if(!obj.data.id_card_side) obj.data.id_card_side = "front";
	if(file){
		vk.pubfn.fileToBase64({ file }).then(base64 => {
			obj.data.image = base64;
			delete obj.data.file;
			baidu.request(obj);
		});
	}else{
		baidu.request(obj);
	}
}

/**
 * 百度开放平台通用请求接口
 * @param {String} action        接口名称
 * @param {String} actionVersion 接口版本名称 默认2.0
 * @param {String} title         loading文字
 * @param {object} data          请求参数
 * @param {String} success       成功回调
 * @param {String} fail          失败回调
 * @param {String} complete      完成回调
 * 使用示例
vk.openapi.baidu.request({
 	action: 'ocr/v1/business_license',
 	title:"识别中...",
 	data: {
 		image:base64
 	},
 	success: (data) => {
 		that.data = data;
 	},
});
 */
baidu.request = function(obj={}){
	let {
		title
	} = obj;
	if(title) vk.showLoading(title);
	let baiduApiAccessToken = vk.getStorageSync(baiduOpenApiAccessTokenCacheName);
	if(baiduApiAccessToken && baiduApiAccessToken.expTime > new Date().getTime()){
		// 获取缓存中的token
		obj.accessToken = baiduApiAccessToken.accessToken;
		request(obj);
	}else{
		// 发起请求获取token
		vk.callFunction({
			url: 'plugs/baidu/client/pub/getAccessToken',
			success:function(tokenRes) {
				vk.setStorageSync(baiduOpenApiAccessTokenCacheName,{
					accessToken : tokenRes.access_token,
					expTime :  2590000000 + new Date().getTime(),
				});
				obj.accessToken = tokenRes.access_token;
				request(obj);
			},
			fail:function(res){
				if(title) vk.hideLoading();
				if(typeof obj.fail === "function") obj.fail(res);
				if(typeof obj.complete === "function") obj.complete(res);
			}
		});
	}
}

function request(obj={}){
	let {
		action,
		actionVersion = "2.0",
		accessToken,
		header = { "content-type": "application/x-www-form-urlencoded" },
		data,
		title
	} = obj;
	vk.request({
		url: `https://aip.baidubce.com/rest/${actionVersion}/${action}?access_token=${accessToken}`,
		method:"POST",
		header:{
			"content-type": "application/x-www-form-urlencoded",
		},
		errorCodeName:"error_code",
		errorMsgName:"error_msg",
		data,
		needAlert:true,
		success: function(data){
			if(title) vk.hideLoading();
			if(data.code){
				if(typeof obj.fail === "function") obj.fail(data);
			}else{
				if(typeof obj.success === "function") obj.success(data);
			}
		},
		fail: function(data){
			if(title) vk.hideLoading();
			// 如果是因为token失效报的错误,则清空下本地token缓存
			if(data && data.code === 110) vk.removeStorageSync(baiduOpenApiAccessTokenCacheName);
			if(typeof obj.fail === "function") obj.fail(data);
		},
		complete: function(data){
			if(typeof obj.complete === "function") obj.complete(data);
		}
	});
}

export default baidu;
