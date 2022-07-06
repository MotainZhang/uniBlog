'use strict';
module.exports = {
	/**
	 * 批量修改用户可登录的客户端
	 * @url admin/system/user/sys/batchUpdateAppLogin 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { uniID, customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等
		let {
			user_ids,
			allow_login_background = false,
			dcloud_appid,
			login_appid_type,
			mode
		} = data;
		if(vk.pubfn.isNullOne(user_ids, login_appid_type, mode)){
			return { code: -1, msg: "参数错误" };
		}
		if(mode !== 1 && typeof dcloud_appid !== "string"){
			return { code: -1, msg: "新增和移除模式下，dcloud_appid只能是字符串" };
		}
		let dataJson = {};
		dataJson["allow_login_background"] = allow_login_background;
		if(login_appid_type === 0){
			// 可登录全部应用
			dataJson["dcloud_appid"] = _.remove();
		} else{
			res.successNum = 0;
			res.failNum = 0;
			for(let i=0; i<user_ids.length; i++){
				let user_id = user_ids[i];
				let updateRes;
				try {
					if(mode === 1){
						// 可登录部分应用
						updateRes = await uniID.setAuthorizedAppLogin({
							uid: user_id,
							dcloudAppidList: dcloud_appid
						});
					}else if(mode === 2){
						// 可登录部分应用
						updateRes = await uniID.authorizeAppLogin({
							uid: user_id,
							dcloudAppid: dcloud_appid
						});
					}else if(mode === 3){
						// 可登录部分应用
						updateRes = await uniID.forbidAppLogin({
							uid: user_id,
							dcloudAppid: dcloud_appid
						});
					}
				}catch(err){}
				if(updateRes.code === 0){
					res.successNum ++;
				}else{
					res.failNum ++;
				}
			}
		}
		res.num = await vk.baseDao.update({
			dbName:"uni-id-users",
			whereJson:{
				_id: _.in(user_ids)
			},
			dataJson
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
