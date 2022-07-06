module.exports = {
  /**
   * 根据where条件获取单条记录(首条)
   * @url template/db_api/pub/findByWhereJson 前端调用的url参数地址
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
		res.item = await vk.baseDao.findByWhereJson({
			dbName:"vk-test",
			fieldJson:{
				
			},
			whereJson:{
				_id:data._id,
			}
		});
		// 上面的 fieldJson 可以设置 显示什么字段或设置不显示什么字段 如 money:false 代表不显示money字段
		// 对应的sql:
		// select * from vk-test where _id = "5f3a125b3d11c6000106d338"
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}