module.exports = {
  /**
   * 设置头像
   * @url user/kh/setAvatar 前端调用的url参数地址
   * @description 设置当前登录用户的头像
	 * data 请求参数 说明
	 * @param {String} avatar 用户头像URL
	 * @param {Boolean} deleteOldFile 是否同时删除云储存内的头像文件
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
   */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始----------------------------------------------------------- 
		let { avatar, deleteOldFile } = data;
		// 设置头像
		res = await uniID.setAvatar(event.data);
		// 判断是否需要删除旧头像的云储存文件
		if(res.code ===0 && deleteOldFile && userInfo.avatar){
			try {
			   await uniCloud.deleteFile({
			   	fileList: [
			   		userInfo.avatar
			   	]
			   });
			}catch(err){
			  res.deleteFileErr = err;
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}