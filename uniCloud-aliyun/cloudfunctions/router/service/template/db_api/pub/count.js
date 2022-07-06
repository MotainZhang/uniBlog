module.exports = {
  /**
   * count求总记录条数
   * @url template/db_api/pub/count 前端调用的url参数地址
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
		res.num = await vk.baseDao.count({
			dbName:"vk-test",
			whereJson:{

			}
		});
		// 对应的sql:
		// count * from vk-test
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}
