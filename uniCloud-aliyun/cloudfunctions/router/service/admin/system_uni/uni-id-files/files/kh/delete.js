module.exports = {
	/**
	 * 删除
	 * @url admin/system_uni/uni-id-files/files/kh/delete 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String,Array<String>} _id 		id 或id数组
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { _id } = data;
		// 参数非空检测
		if (vk.pubfn.isNullOne(_id)) {
			return { code: -1, msg: '_id不能为空' };
		} 
		let whereJson = {};
		let { role = [] } = userInfo;
		if (role.indexOf("admin") === -1) {
			// 如果不是admin角色用户，则只能删除自己上传的
			whereJson["user_id"] = uid;
		}
		if (typeof _id === "string") {
			// 单条删除
			whereJson["_id"] = _id;
		} else if (typeof _id === "object") {
			// 批量删除
			whereJson["_id"] = _.in(_id);
		}
		let selectRes = await vk.baseDao.select({
			dbName: "vk-files",
			pageIndex: 1,
			pageSize: 500,
			getMain: true,
			whereJson,
			fieldJson: {
				file_id: true
			}
		});
		if (selectRes.length > 0) {
			try {
				let fileList = vk.pubfn.arrayObjectGetArray(selectRes, "file_id");
				await uniCloud.deleteFile({ fileList });
			} catch (err) {}
			// 执行数据库API请求
			res.num = await vk.baseDao.del({
				dbName: "vk-files",
				whereJson
			});
		}
		res.msg = "ok";
		return res;
	}

}
