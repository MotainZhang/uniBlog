
const install = Vue => {
	const debug = process.env.NODE_ENV !== 'production';
	let vk = Vue.prototype ? Vue.prototype.vk : Vue.config.globalProperties.vk;
	if (debug && vk) {
		const oldErrorHandler = Vue.config.errorHandler;
		Vue.config.errorHandler = function errorHandler(err, vm, info) {
			const route = vm.$page && vm.$page.route;
			let date = new Date();
			let log =  {
				err: err.toString(),
				info,
				route,
				time: date.getTime(),
				timeStr: date.toLocaleTimeString()
			};
			if(vk.vuex) vk.vuex.dispatch('$error/add', log);
			return oldErrorHandler(err, vm, info);
		}
	}
}

export default {
	install
}
