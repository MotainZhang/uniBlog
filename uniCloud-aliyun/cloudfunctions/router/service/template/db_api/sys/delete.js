module.exports = {
  /**
   * 数据删除
   * @url template/db_api/sys/delete 前端调用的url参数地址
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
		// 这里id不传默认设置成"___" 是为了防止因未传_id导致误删所有数据.
		let { _id } = data;
		if(vk.pubfn.isNull(_id)){
			return { code : -1, msg : 'id不能为空' };
		}
		let dbName = "vk-test";
		await vk.baseDao.deleteById({
			dbName,
			id:_id
		});
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }

}
