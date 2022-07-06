module.exports = {
  /**
   * 此函数名称
   * @url template/db_api/user/pub/Promise.all 前端调用的url参数地址
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
		let addNum = 200;
		console.log(new Date(runTime1),"开始运行,添加"+addNum+"条数据");
		// 承载所有读操作的 promise 的数组
		let tasks = [];
		for(let i = 1; i <= addNum; i++){
			let promise = vk.baseDao.add({
				dbName:dbName,
				dataJson:{
					"money": 10.02+i,
					"_add_time": 1597456395010+i,
					"user_id": "001"
				}
			});
			tasks.push(promise);
		}
		// 等待所有
		let ids = [];
		try {
			res = await Promise.all(tasks).then((values) => {
				return {
					//ids:values,
					total:values.length
				};
			});
		} catch (e) {
			//console.log("异常:",e,res);
			console.log("异常:运行超时");
			res.msg = "运行超时";
		}
		let runTime2 = new Date().getTime();
		let runTime =  (runTime2 - runTime1) / 1000 + "秒";
		console.log(new Date(runTime2),"运行结束,耗时:"+runTime);
		res.runTime = runTime;
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}