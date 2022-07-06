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
	async add(event){
		let { data = {}, userInfo, util } = event;
		let { vk } = util;
		let res = { code : 0, msg : '' };
		
		// 验证规则开始 -----------------------------------------------------------
		let rules = {
			menu_id: [
				{ required: true, message: '菜单标识不能为空', trigger: 'blur' },
			],
			name: [
				{ required: true, message: '菜单名称不能为空', trigger: 'blur' },
			],
			sort:[
				{ type: 'number', message: '排序值必须为数字'}
			]
		};
		// 验证规则结束 -----------------------------------------------------------
		
		// 开始进行验证
		res = vk.pubfn.formValidate({
			data : data,
			rules : rules
		});
		// 返回验证结果
		return res;
	}
	/**
	 * 修改
	 */
	async update(event){
		return this.add(event);
	}
	
	/**
	 * 批量添加
	 */
	async adds(event){
		let { data = {}, userInfo, util } = event;
		let { vk } = util;
		let res = { code : 0, msg : '' };
		// 验证规则开始 -----------------------------------------------------------
		let rules = {
			menu_id: [
				{ required: true, message: '菜单标识不能为空', trigger: 'blur' },
			],
			name: [
				{ required: true, message: '菜单名称不能为空', trigger: 'blur' },
			],
			sort:[
				{ type: 'number', message: '排序值必须为数字'}
			]
		};
		// 验证规则结束 -----------------------------------------------------------
		let { menus } = data;
		for(let i=0;i<menus.length;i++){
			let formValidateRes = vk.pubfn.formValidate({
				data : menus[i],
				rules : rules
			});
			if(formValidateRes.code != 0){
				res = formValidateRes;
				break;
			}
		}
		return res;
	}
}
module.exports = new Util