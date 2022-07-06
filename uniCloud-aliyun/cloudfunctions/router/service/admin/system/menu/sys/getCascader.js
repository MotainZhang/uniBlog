'use strict';
module.exports = {
	/**
	 * 获取菜单级联数据(懒加载形式)
	 * @url admin/system/menu/sys/getCascader 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Object} node 			当前点击的节点
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let { node = {} } = data;
		let whereJson = {
			enable: true
		};
		if (node.root) {
			whereJson["parent_id"] = null;
		} else {
			whereJson["parent_id"] = node.value;
		}
		res = await vk.baseDao.selects({
			dbName: "opendb-admin-menus",
			pageIndex: 1,
			pageSize: 500,
			whereJson,
			sortArr: [{ name: "sort", type: "asc" }],
			// 副表列表
			foreignDB: [
				{
					dbName: "opendb-admin-menus",
					localKey:"menu_id",
					foreignKey: "parent_id",
					as: "hasChildren",
					limit: 1, // 避免浪费查询,这里设置limit:1
				}
			]
		});
		// 数据预处理
		let rows = res.rows;
		for (let i in rows) {
			let item = rows[i];
			rows[i].label = `${item.name}（${item.menu_id}）`;
			if(vk.pubfn.isNull(item.hasChildren)){
				rows[i].leaf = true;
			}
		}
		res.rows = rows;
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
