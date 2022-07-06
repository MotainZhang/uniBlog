module.exports = {
	/**
	 * 修改
	 * @url admin/system_uni/uni-id-files/files/kh/update 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} display_name 		显示在后台的文件名称
	 * @param {String} category_id 		分类id
	 * @param {Number} status 					0:未审核 1:已审核通过 2:审核不通过
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
		let {
			_id,
			display_name,
			category_id,
			cover_image,
			status = 0
		} = data;
		// 参数非空检测
		if (vk.pubfn.isNullOne(_id)) {
			return { code: -1, msg: '_id不能为空' };
		}
		let dbName = "vk-files";
		let whereJson = {};
		let dataJson = {
			display_name,
			category_id,
			cover_image,
			status
		};
		let { role = [] } = userInfo;
		if (role.indexOf("admin") === -1) {
			// 如果不是admin角色用户，则只能修改自己上传的
			whereJson["user_id"] = uid;
		}
		if (typeof _id === "string") {
			// 单条操作
			whereJson["_id"] = _id;
		} else if (typeof _id === "object") {
			// 批量操作
			whereJson["_id"] = _.in(_id);
		}
		if (category_id == "null" || category_id === "") {
			dataJson["category_id"] = _.remove();
		}

		// 执行数据库API请求
		res.num = await vk.baseDao.update({
			dbName: dbName,
			whereJson,
			dataJson
		});

		return res;
	}

}
