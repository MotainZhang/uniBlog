var updateManager = {};
/**
 * 本API返回全局唯一的版本更新管理器对象： updateManager，用于管理小程序更新。
 * vk.updateManager.updateReady();
 */
updateManager.updateReady = function(obj) {
	// #ifdef MP
	updateManagerByMP(obj);
	// #endif
};


export default updateManager;


function updateManagerByMP (obj={}){
	let {
		title = "更新提示",
		content = "新版本已经准备好，点击更新！",
		autoUpdate = true,
		showCancel = false,
		confirmText = "一键更新"
	} = obj;
	const updateManager = uni.getUpdateManager();
	
	updateManager.onCheckForUpdate(function (res) {
		// 请求完新版本信息的回调
		// console.log(res.hasUpdate);
	});
	
	updateManager.onUpdateReady(function (res) {
		uni.showModal({
			title,
			content,
			showCancel,
			confirmText,
			success(res) {
				if (res.confirm) {
					if(typeof obj.success === "function"){
						obj.success({
							applyUpdate : updateManager.applyUpdate
						});
					}
					if(typeof obj.complete === "function") obj.complete();
					if(autoUpdate){
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			},
			
		});
	});
	
	updateManager.onUpdateFailed(function (res) {
		// 新的版本下载失败
		console.error("onUpdateFailed",res);
		if(typeof obj.fail === "function") obj.fail(res);
		if(typeof obj.complete === "function") obj.complete();
	});
}

