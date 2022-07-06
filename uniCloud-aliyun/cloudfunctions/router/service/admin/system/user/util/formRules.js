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
			username: [
				{ required: true, validator: vk.pubfn.validator("username"),
					message: '用户名以字母开头，长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur' }
			],
			nickname: [
				{ required: true, message: '昵称为必填字段', trigger: 'blur' },
				{ min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
			],
			password: [
				{ validator:vk.pubfn.validator("password"), message: '密码长度在6~18之间，只能包含字母、数字和下划线', trigger: 'blur' }
			],
			mobile: [
				{ validator: vk.pubfn.validator("mobile"), message: '手机号格式错误', trigger: 'blur' }
			],
			email: [
				{ validator: vk.pubfn.validator("email"), message: '邮箱格式错误', trigger: 'blur' }
			],
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
				{ required: true, message: '用户ID不能为空', trigger: 'blur' },
			],
			nickname: [
				{ required: true, message: '昵称为必填字段', trigger: 'blur' },
				{ min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
			],
			mobile: [
				{ validator: vk.pubfn.validator("mobile"), message: '手机号格式错误', trigger: 'blur' }
			],
			email: [
				{ validator: vk.pubfn.validator("email"), message: '邮箱格式错误', trigger: 'blur' }
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
