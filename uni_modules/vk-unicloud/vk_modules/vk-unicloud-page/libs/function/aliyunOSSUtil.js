/**
 * 阿里云oss工具类
 */
var aliyunOSSUtil = {};
var counterNum = 0;

/**
 * 上传至阿里云oss
vk.callFunctionUtil.uploadFile({
	filePath:tempFilePath,
	fileType:"image",
	provider:"aliyun",
	index,
	onUploadProgress:function(res){
		// 上传过程中
		if (res.progress > 0) {
			if(list[index]){
				list[index].progress = res.progress;

			}
		}
	},
	success:function(res){
		// 上传成功

	},
	fail:function(res){
		// 上传失败

	}
});
 */
aliyunOSSUtil.uploadFile = function(obj) {
	let {
		filePath,
		fileType = "image",
		name = "file",
		header = {
			"x-oss-forbid-overwrite": true,
		},
		index = 0,
		file = {},
		needSave = false,
		category_id,
		title,
	} = obj;
	let vk = getApp().globalData.vk;
	if (title) vk.showLoading(title);
	let fileNameObj = createFileName(obj);
	let aliyunOSS = getConfig();
	let fileName = fileNameObj.fileFullName;
	let formData = vk.pubfn.copyObject(aliyunOSS.uploadData);
	formData["key"] = fileName; // 存储在oss的文件路径
	/**
	 * 特别说明
	 * 若已知本地图片,则使用formData["name"] = filePath
	 * 若已知base64,则是用formData["file"] = file;// file base64字符串转成blob对象
	 */
	if (filePath.indexOf(";base64,") > -1) {
		formData["file"] = dataURLtoBlob(filePath);
	} else {
		formData["name"] = filePath;
	}
	let Logger = {};
	Logger.startTime = new Date().getTime();
	Logger.filePath = filePath;
	return new Promise((resolve, reject) => {
		let uploadTask = uni.uploadFile({
			url: aliyunOSS.action,
			filePath,
			name,
			header,
			formData: formData,
			success: function(res) {
				if (title) vk.hideLoading();
				if (![200, 201].includes(res.statusCode)) {
					if (typeof obj.fail === "function") obj.fail(res);
					Logger.error = res;
				} else {
					// 上传成功
					res.fileID = fileNameObj.url;
					Logger.result = res;
					if (typeof obj.success === "function") obj.success(res);
					resolve(res);
					if (needSave) {
						// 保存文件记录到数据库
						vk.userCenter.addUploadRecord({
							data: {
								url: res.fileID,
								name: file.name,
								size: file.size,
								file_id: res.fileID,
								provider: "aliyun",
								category_id
							},
							filePath,
							fileType,
							success: function() {
								if (typeof obj.addSuccess == "function") obj.addSuccess(res);
							},
							fail: function(res) {
								if (typeof obj.addFail === "function") obj.addFail(res);
							}
						});
					}
				}
			},
			fail: function(res) {
				if (title) vk.hideLoading();
				Logger.error = res;
				if (res.errMsg && res.errMsg.indexOf('fail url not in domain list') > -1) {
					vk.toast('上传域名未在白名单中');
				}
				if (typeof obj.fail === "function") obj.fail(res);
			},
			complete: function() {
				let vk = getApp().globalData.vk;
				let config = vk.callFunctionUtil.config;
				if (config.debug) {
					Logger.endTime = new Date().getTime();
					Logger.runTime = (Logger.endTime - Logger.startTime);
					let colorArr = config.logger.colorArr;
					let colorStr = colorArr[counterNum % colorArr.length];
					counterNum++;
					console.log("%c--------【开始】【阿里云oss文件上传】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
					console.log("【本地文件】: ", Logger.filePath);
					console.log("【返回数据】: ", Logger.result);
					console.log("【预览地址】: ", Logger.result.fileID);
					console.log("【上传耗时】: ", Logger.runTime, "毫秒");
					console.log("【上传时间】: ", vk.pubfn.timeFormat(Logger.startTime, "yyyy-MM-dd hh:mm:ss"));
					if (Logger.error) console.error("【error】:", Logger.error);
					console.log("%c--------【结束】【阿里云oss文件上传】--------", 'color: ' + colorStr + ';font-size: 12px;font-weight: bold;');
				}
			}
		});
		uploadTask.onProgressUpdate((res) => {
			if (res.progress > 0) {
				if (typeof obj.onUploadProgress === "function") obj.onUploadProgress(res);
			}
		});
	});
};


export default aliyunOSSUtil;


// 获取配置
function getConfig() {
	let vk = getApp().globalData.vk;
	let config = vk.callFunctionUtil.getConfig();
	let aliyunOSS = vk.pubfn.getData(config, "service.aliyunOSS");
	let configData = {};
	if (aliyunOSS && aliyunOSS.uploadData && aliyunOSS.uploadData.OSSAccessKeyId) {
		try {
			if (aliyunOSS.groupUserId && typeof vk.getVuex === "function") {
				let userInfo = vk.getVuex("$user.userInfo");
				if (vk.pubfn.isNotNull(userInfo) && userInfo._id) {
					aliyunOSS.dirname += `/${userInfo._id}`;
				}
			}
		} catch (err) {}
		configData = {
			uploadData: {
				OSSAccessKeyId: aliyunOSS.uploadData.OSSAccessKeyId,
				policy: aliyunOSS.uploadData.policy,
				signature: aliyunOSS.uploadData.signature,
				success_action_status: 200,
				key: "test.png"
			},
			action: aliyunOSS.action,
			dirname: aliyunOSS.dirname,
			host: aliyunOSS.host,
		};
	}
	return configData;
}
// 生成文件名
function createFileName(obj = {}) {
	let {
		index = 0,
			file,
			filePath,
	} = obj;
	let vk = getApp().globalData.vk;
	let aliyunOSS = getConfig();
	let dirname = aliyunOSS.dirname;
	let host = aliyunOSS.host;
	let fileObj = {};

	let suffix = getFileSuffix(obj);
	let oldName = index + "." + suffix;
	if (file && file.name) {
		let suffixName = file.name.substring(file.name.lastIndexOf(".") + 1);
		if (suffixName && suffixName.length < 5) oldName = file.name;
		// 只保留["数字","英文",".","-"]
		oldName = oldName.replace(/[^a-zA-Z.-d]/g, '');
		if (oldName.indexOf(".") == 0) oldName = "0" + oldName;
	}
	let date = new Date();
	let dateYYYYMMDD = vk.pubfn.timeFormat(date, "yyyy/MM/dd");
	let dateTime = date.getTime().toString(); // 时间戳
	// 时间戳后8位
	let dateTimeEnd8 = dateTime.substring(dateTime.length - 8, dateTime.length);
	let randomNumber = vk.pubfn.random(8); // 8位随机数
	// 文件路径 = 固定路径名 + 业务路径
	let servicePath = "";
	let newFilePath = dirname + "/" + servicePath + dateYYYYMMDD + "/";
	// 文件名 = 时间戳后8位 - 随机数8位 + 后缀名
	let fileNickName = dateTimeEnd8 + randomNumber + "-" + oldName;
	// 文件名全称(包含文件路径) = 外网域名 + 文件路径 + 文件名
	let fileFullName = newFilePath + fileNickName;
	// 外网地址 = 外网域名 + 文件路径 + 文件名
	let url = host + "/" + fileFullName;
	fileObj.url = url;
	fileObj.fileFullName = fileFullName;
	fileObj.fileNickName = fileNickName;
	return fileObj;
}

function getFileSuffix(obj = {}) {
	let {
		file,
		filePath
	} = obj;
	let suffix = "png";
	if (filePath) {
		let suffixName = filePath.substring(filePath.lastIndexOf(".") + 1);
		if (suffixName && suffixName.length < 5) suffix = suffixName;
	}
	if (file) {
		if (file.path) {
			let suffixName = file.path.substring(file.path.lastIndexOf(".") + 1);
			if (suffixName && suffixName.length < 5) suffix = suffixName;
		}
		if (file.name) {
			let suffixName = file.name.substring(file.name.lastIndexOf(".") + 1);
			if (suffixName && suffixName.length < 5) suffix = suffixName;
		}
	}
	return suffix;
}

function dataURLtoBlob(dataurl) {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
