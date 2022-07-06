var isOnLaunch = true;
export default {
	data() {
		return {}
	},
	onLoad() {
		// 将vk实例挂载到app.globalData上，方便在非Vue页面自身函数中调用vk实例（因为获取不到this）
		let app = getApp({ allowDefault: true });
		if (app && app.globalData && !app.globalData.vk) {
			app.globalData.vk = this.vk;
		}
		if (this.vk) {
			const url = this.vk.pubfn.getCurrentPageRoute();
			// 检测是否可以分享(小程序专属)
			this.vk.navigate.checkAllowShare({ url });
			// 检测是否需要登录，只有首次启动的页面才需要检测，其他页面通过 vk.navigateTo 跳转前会自动判断。
			if (isOnLaunch && !this.vk.checkToken() && getCurrentPages().length == 1) {
				isOnLaunch = false; // 重新标记为非首次页面
				const currentPage = this.vk.pubfn.getCurrentPage() || {};
				this.vk.pubfn.checkLogin({ url: currentPage.fullPath || url, isOnLaunch: true }); // 检测是否需要登录
			}
		}
	},
	created() {
		// 将vk实例挂载到app.globalData上，方便在非Vue页面自身函数中调用vk实例（因为获取不到this）
		let app = getApp({ allowDefault: true });
		if (app && app.globalData && !app.globalData.vk) {
			app.globalData.vk = this.vk;
		}
	},
	methods: {
		$getData(data, key, defaultValue) {
			let { vk } = this;
			return vk.pubfn.getData(data, key, defaultValue);
		}
	}
}
