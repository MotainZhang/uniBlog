module.exports = {
  /**
   * 分组求count
   * @url template/db_api/pub/groupCount 前端调用的url参数地址
   * data 请求参数 说明
   * res 返回参数说明
   * @params {Number} code 错误码，0表示成功
   * @params {String} msg 详细信息
   */
  main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		let { _id = "___" } = data;
		res = await vk.baseDao.selects({
			dbName: "vk-test",
			pageIndex: 1,
			pageSize: 10,
			// 主表where条件
			whereJson: {

			},
			groupJson: {
				_id: "$money", // _id是分组id， $ 后面接字段名，如按money字段进行分组
				count: _.$.addToSet("$user_id"), // $ 后面接字段名，如把user_id原样输出（去重）
			},
			sortArr: [{ name: "money",type: "desc" }], // 对分组后的结果进行排序
			addFields:{
				count: _.$.size("$count")
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}
