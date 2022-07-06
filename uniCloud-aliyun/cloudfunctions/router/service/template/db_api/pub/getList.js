module.exports = {
  /**
   * 查询多条记录 分页
   * @url template/db_api/pub/getList 前端调用的url参数地址
   * data 请求参数 说明
	 * @params {String} tableName 	表名
   * @params {String} addTime 		搜索开始时间
   * @params {String} endTime 		搜索截止时间
	 * @params {String} searchvalue 搜索指定内容
	 * @params {Number} pageIndex 	当前页码
	 * @params {Number} pageSize 		每页显示数量
   * res 返回参数说明
   * @params {Number} code 错误码，0表示成功
   * @params {String} msg 详细信息
   */
  main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
    // 业务逻辑开始----------------------------------------------------------- 
		// 可写与数据库的交互逻辑等等
		let { pageIndex, pageSize, searchvalue, timeArr = [], addTimeLong, endTimeLong, sortRule } = data;
		let dbName = "vk-test";
		let fieldJson = {};
		let whereJson = {};
		let sortArr = [];
		// 排序规则开始-----------------------------------------------------------
		sortArr.push({
			"name":"_add_time",
			"type":"desc"
		});
		if(sortRule) sortArr = sortRule;
		// 排序规则结束-----------------------------------------------------------
		// 查询条件开始-----------------------------------------------------------
		if(searchvalue){
			// 查询searchvalue开头的数据
			try{
				// 如果查询需要用到正则，建议将正则用try catch 包起来。
			  //whereJson["title"] = new RegExp('^'+searchvalue);
				whereJson["money"] = Number(searchvalue);
			}catch(err){
			  return { code : -1, msg : '请输入合法的查询内容' };
			}
		}
		if(timeArr.length >=2 ){
			addTimeLong = timeArr[0];
			endTimeLong = timeArr[1];
		}
		if(addTimeLong && endTimeLong){
			whereJson["_add_time"] =  _.gte(addTimeLong).lte(endTimeLong);
		}else if(addTimeLong && !endTimeLong){
			whereJson["_add_time"] =  _.gte(addTimeLong);
		}else if(!addTimeLong && endTimeLong){
			whereJson["_add_time"] =  _.lte(endTimeLong);
		}
		// 这里可以写必须满足的查询条件，如whereJson["user_id"] = uid;代表只查自己的记录
		// whereJson["user_id"] = uid;
		// 查询条件结束-----------------------------------------------------------
		res = await vk.baseDao.select({
			dbName:dbName,
			getCount:true,
			pageIndex:pageIndex,
			pageSize:pageSize,
			fieldJson:fieldJson,
			whereJson:whereJson,
			sortArr:sortArr
		});
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}