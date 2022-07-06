module.exports = {
  /**
   * 批量添加数据
   * @url template/db_api/pub/adds 前端调用的url参数地址
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
		let dbName = "vk-test";
		let runTime1 = new Date().getTime();
		let addNum = 10;
		console.log(new Date(runTime1),"开始运行,添加"+addNum+"条数据");
		// 承载所有读操作的 promise 的数组
		let dataArr = [];
		
		for(let i = 1; i <= addNum; i++){
			// 随机定位开始-----------------------------------------------------------
			// 为了方便测试,这里固定在杭州市西湖区附近
			let longitude = 120.12792 + Math.floor(Math.random() * 500) / 10000;
			let latitude = 30.228932  + Math.floor(Math.random() * 500) / 10000;
			// 随机定位结束-----------------------------------------------------------
			dataArr.push({
				"money": Math.floor(Math.random() * 9 + 1),
				"user_id": "00"+Math.floor(Math.random() * 2 + 1),
				"location":new db.Geo.Point(longitude, latitude),
				"position":{
					"longitude":longitude,
					"latitude":latitude,
				},
			});
		}
		await vk.baseDao.adds({
			dbName:dbName,
			dataJson:dataArr
		});
		
		let runTime2 = new Date().getTime();
		let runTime = ((runTime2 - runTime1) / 1000 + "秒");
		console.log(new Date(runTime2),"运行结束,耗时:"+runTime);
		res.runTime = runTime;
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}