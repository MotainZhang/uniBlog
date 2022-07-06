module.exports = {
	/**
	 * 根据地理位置获取列表数据信息
	 * @url template/db_api/pub/geo 前端调用的url参数地址
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
		res = await vk.baseDao.selects({
			dbName:"vk-test",
			pageIndex:1,
			pageSize:100,
			whereJson:{
				location: _.geoNear({
				  geometry: new db.Geo.Point(120.12792, 30.228932),	// 点的地理位置,为了方便测试,这里固定在杭州市西湖区
				  maxDistance: 4000,	// 选填，最大距离，米为单位
				  minDistance: 0			// 选填，最小距离，米为单位
				})
			},
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}