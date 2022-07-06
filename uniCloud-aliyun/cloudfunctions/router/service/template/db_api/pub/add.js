module.exports = {
  /**
   * 添加单条数据
   * @url template/db_api/pub/add 前端调用的url参数地址
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
		// 随机定位开始-----------------------------------------------------------
		// 为了方便测试,这里固定在杭州市西湖区附近
		let longitude = 120.12792 + Math.floor(Math.random() * 500) / 10000;
		let latitude = 30.228932  + Math.floor(Math.random() * 500) / 10000;
		// 随机定位结束-----------------------------------------------------------
		res.id = await vk.baseDao.add({
			dbName:"vk-test",
			dataJson:{
				"money": Math.floor(Math.random() * 9 + 1),
				"user_id": "00"+Math.floor(Math.random() * 2 + 1),
				"location":new db.Geo.Point(longitude, latitude),
				"position":{
					"longitude":longitude,
					"latitude":latitude,
				},
			}
		});
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}
