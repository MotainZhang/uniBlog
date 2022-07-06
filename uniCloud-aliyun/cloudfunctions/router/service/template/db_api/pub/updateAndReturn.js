module.exports = {
	/**
	 * 修改数据,并返回修改后的数据
	 * @url template/db_api/pub/updateAndReturn 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		let { _id = "___" } = data;

		// 非事务版本开始-----------------------------------------------------------
		res.info = await vk.baseDao.updateAndReturn({
			dbName: "vk-test",
			whereJson: {
				_id: _id
			},
			dataJson: {
				money: _.inc(1)
			},
		});
		// 非事务版本结束-----------------------------------------------------------


		// 事务版本开始-----------------------------------------------------------
		/*
		const transaction = await vk.baseDao.startTransaction();
		try {
		  res.info = await vk.baseDao.updateAndReturn({
				db:transaction,
		  	dbName:"vk-test",
		  	whereJson:{
					_id:_id
				},
		  	dataJson:{
		  		money:_.inc(1)
		  	},
		  });
		  // 提交事物
		  await transaction.commit();
		  console.log(`transaction succeeded`);
		  return res;
		}catch (err) {
		  // 事务回滚
			return await vk.baseDao.rollbackTransaction({
				db:transaction,
				err
			});
		}
		*/
		// 事务版本结束-----------------------------------------------------------

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}

}
