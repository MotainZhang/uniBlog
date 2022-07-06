module.exports = {
	/**
	 * 分页查询
	 * @url admin/system_uni/uni-id-log/sys/getList 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Number}         pageIndex 当前页码
	 * @param {Number}         pageSize  每页显示数量
	 * @param {Array<Object>}  sortRule  排序规则
	 * @param {object}         formData  查询条件数据源
	 * @param {Array<Object>}  columns   查询条件规则
	 * res 返回参数说明
	 * @param {Number}         code      错误码，0表示成功
	 * @param {String}         msg       详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let { dcloud_appid, appids } = data.formData || {};
		let whereJson = {};
		if (dcloud_appid) {
			if (dcloud_appid === "___empty-array___") {
				whereJson["dcloud_appid"] = [];
			} else if (dcloud_appid === "___error___") {
				whereJson["dcloud_appid"] = _.and(_.exists(true), _.nin(appids));
			} else if (dcloud_appid === "___non-existent___") {
				whereJson["dcloud_appid"] = _.exists(false);
			} else {
				whereJson["dcloud_appid"] = _.or(_.eq(dcloud_appid), _.exists(false));
			}
		}
		let dbName = "uni-id-log";
		res = await vk.baseDao.getTableData({
			dbName,
			data,
			whereJson,
			// 副表列表
			foreignDB: [{
					dbName: "opendb-app-list",
					localKey: "dcloud_appid",
					foreignKey: "appid",
					localKeyType: "array",
					as: "appList",
					limit: 500
				},
				{
					dbName: "uni-id-users",
					localKey: "user_id",
					foreignKey: "_id",
					as: "userInfo",
					limit: 1,
					fieldJson: {
						_id: true,
						avatar: true,
						nickname: true,
						gender: true
					}
				}
			],
		});
		return res;
	}

}
