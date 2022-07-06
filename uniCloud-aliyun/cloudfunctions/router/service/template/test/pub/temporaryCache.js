'use strict';
module.exports = {
	/**
	 * 临时数据缓存
	 * @url template/test/pub/getTemporaryCache 前端调用的url参数地址
	 * data 请求参数 说明
	 * @params {String} uid  当前登录用户id,若用户已登录且token有效,则data中会带uid参数
	 * (此参数是后端过滤器通过token获取并添加到data中的,是可信任的)(只有kh函数才带此参数)
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : 'ok' };
		// 业务逻辑开始----------------------------------------------------------- 
		let { key, value, second, mode } = data;
		if(mode == "get"){
			res.value = vk.temporaryCache.get(key);
		}else if(mode == "set"){
			res.value = vk.temporaryCache.set(key, value, second);
		}else if(mode == "del"){
			res.value = vk.temporaryCache.del(key);
		}else if(mode == "clear"){
			res.value = vk.temporaryCache.clear();
		}else if(mode == "isExpired"){
			res.value = vk.temporaryCache.isExpired(key);
		}else if(mode == "getAll"){
			res.value = vk.temporaryCache.getAll();
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}