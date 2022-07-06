'use strict';
/**
 * 表单验证
 */
class Util {
	constructor() {

	}
	/**
	 * 添加
	 */
	async add(event) {
		let { data = {}, userInfo, util } = event;
		let { vk } = util;
		let res = { code: 0, msg: '' };
		// 验证规则开始 -----------------------------------------------------------
		let rules = {
			appid: [
				{ required: true, message: '应用的AppID为必填字段', trigger: 'blur' },
			],
			name: [
				{ required: true, message: '应用名称为必填字段', trigger: 'blur' }
			],
			type: [
				{ required: true, message: '应用类型为必填字段', trigger: 'blur' }
			]
		};
		// 验证规则结束 -----------------------------------------------------------

		// 开始进行验证
		res = vk.pubfn.formValidate({
			data: data,
			rules: rules
		});
		// 返回验证结果
		return res;
	}
	/**
	 * 修改
	 */
	async update(event) {
		let { data = {}, userInfo, util } = event;
		let { vk } = util;
		let res = { code: 0, msg: '' };

		// 验证规则开始 -----------------------------------------------------------
		let rules = {
			_id: [
				{ required: true, message: 'id不能为空', trigger: 'blur' },
			],
			appid: [
				{ required: true, message: '应用的AppID为必填字段', trigger: 'blur' },
			],
			name: [
				{ required: true, message: '应用名称为必填字段', trigger: 'blur' }
			],
			type: [
				{ required: true, message: '应用类型为必填字段', trigger: 'blur' }
			]
		};
		// 验证规则结束 -----------------------------------------------------------

		// 开始进行验证
		res = vk.pubfn.formValidate({
			data: data,
			rules: rules
		});
		// 返回验证结果
		return res;
	}
}
module.exports = new Util
