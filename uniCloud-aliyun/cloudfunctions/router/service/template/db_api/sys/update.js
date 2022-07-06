module.exports = {
  /**
   * 修改数据
   * @url template/db_api/sys/update 前端调用的url参数地址
   * data 请求参数 说明
   * res 返回参数说明
   * @params {Number} code 错误码，0表示成功
   * @params {String} msg 详细信息
   */
  main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			_id,
			user_id,
			money,
			remark,
		} = data;
		if(vk.pubfn.isNullOne(_id)){
			return { code : -1, msg : '参数错误' };
		}
		let dbName = "vk-test";
		await vk.baseDao.updateById({
			dbName,
			id:_id,
			dataJson:{
				user_id,
				money,
				remark,
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}
