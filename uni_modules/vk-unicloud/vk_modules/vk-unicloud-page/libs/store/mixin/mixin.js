export default {
	beforeCreate() {
		// 将vuex方法挂在到vk实例中 beforeCreate created
		let { vk, $store } = this;
		if (typeof $store !== "undefined" && typeof vk.getVuexStore === "undefined") {
			vk.getVuexStore = function() {
				return $store;
			};
			vk.vuex = (name, value) => {
				$store.commit('updateStore', { name, value });
			};
			/**
			 * (推荐) 设置vuex
			 * vk.vuex.set('$user.userInfo.avatar', avatar);
			 */
			vk.vuex.set = (name, value) => {
				$store.commit('updateStore', { name, value });
			};
			/**
			 * (推荐) 读取vuex(具有解除对象内存印射功能，且任意一层数据为undefined，不会报错)
			 * vk.vuex.get('$user.userInfo.avatar');
			 */
			vk.vuex.get = (name, defaultValue) => {
				let value = vk.pubfn.getData($store.state, name);
				if (typeof value === "undefined") return (typeof defaultValue !== "undefined") ? defaultValue : "";
				return JSON.parse(JSON.stringify(value));
			};
			vk.vuex.getters = (name) => {
				return $store.getters[name];
			};
			/**
			 * 触发vuex的指定actions(异步)
			 * $user是模块名,addFootprint是对应模块的action名称
			 * vk.vuex.dispatch('$user/addFootprint', data);
			 */
			vk.vuex.dispatch = $store.dispatch;
			/**
			 * 触发vuex的指定mutations
			 * $user是模块名,setFootprint是对应模块的action名称
			 * vk.vuex.commit('$user/setFootprint', data);
			 */
			vk.vuex.commit = $store.commit;

			/* 另一种方式 */
			/**
			 * vk.setVuex('$user.userInfo.avatar', avatar);
			 */
			vk.setVuex = vk.vuex.set;
			/**
			 * vk.getVuex('$user.userInfo.avatar');
			 */
			vk.getVuex = vk.vuex.get;
			/* 兼容老版本 */
			vk.state = vk.vuex.get;
		}
	},
	computed: {

	}
}
