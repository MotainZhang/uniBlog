module.exports = {
	/**
	 * 数据删除
	 * @url admin/kong/sys/delete 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let {
			data = {}, userInfo, util, filterResponse, originalParam
		} = event;
		let {
			customUtil,
			uniID,
			config,
			pubFun,
			vk,
			db,
			_
		} = util;
		let {
			uid
		} = data;
		let res = {
			code: 0,
			msg: 'ok'
		};
		// 业务逻辑开始-----------------------------------------------------------
		// 删除评论
		if (data.friendId) {
			await vk.baseDao.deleteById({
				dbName:"blog-friend-reply",
				id:data._id
			});
			console.log("=============评论删除成功")
		} else {
			// 删除朋友圈加评论
			await vk.baseDao.deleteById({
				dbName:"blog-friend",
				id:data._id
			});
			console.log("=============圈子删除成功")
			await vk.baseDao.del({
			  dbName:"blog-friend-reply",
			  whereJson:{
			    friendId:data._id
			  }
			});
			console.log("=============评论删除成功")
		}

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}

}
