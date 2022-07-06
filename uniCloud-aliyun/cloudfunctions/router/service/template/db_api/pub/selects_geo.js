module.exports = {
	/**
	 * 连表查询地理位置就近搜索示例
	 * @url template/db_api/pub/selects_geo 前端调用的url参数地址
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
		// 演示3表连接
		res = await vk.baseDao.selects({
			dbName:"vk-test",
			getCount:true,
			pageIndex:1,
			pageSize:10,
			// 主表where条件
			whereJson:{
				location: _.geoNear({
					geometry: new db.Geo.Point(120.12792, 30.228932),	// 点的地理位置,为了方便测试,这里固定在杭州市西湖区
					maxDistance: 4000,        // 选填，最大距离，米为单位
					minDistance: 0			,     // 选填，最小距离，米为单位
					distanceMultiplier:1,     // 返回时在距离上乘以该数字 1代表米 100 代表厘米 0.001 代表千米
					distanceField:"distance", // 输出的每个记录中 distance 即是与给定点的距离
				}),
				money:_.gt(0)
			},
			// 副表列表
			foreignDB:[
				{
					dbName:"uni-id-users",
					localKey:"user_id",
					foreignKey:"_id",
					as:"userInfo",
					limit:1
				}
			]
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
