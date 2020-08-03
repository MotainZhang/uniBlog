// common/http.interceptor.js

// 这里的Vue为Vue对象(非创建出来的实例)，vm为main.js中“Vue.use(httpInterceptor, app)”这一句的第二个参数，
// 为一个Vue的实例，也即每个页面的"this"
// 如果需要了解这个install方法是什么，请移步：https://uviewui.com/components/vueUse.html
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	let baseUrl = ""
	if (process.env.NODE_ENV === 'development'){
		baseUrl = '/api'
	} else {
		baseUrl = ''
	}
	Vue.prototype.$u.http.setConfig({
		baseUrl: '', // 请求的本域名
		method: 'POST',
		// 设置为json，返回后会对数据进行一次JSON.parse()
		dataType: 'json',
		showLoading: false, // 是否显示请求中的loading
		loadingText: '请求中...', // 请求loading中的文字提示
		loadingTime: 1000, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		originalData: false, // 是否在拦截器中返回服务端的原始数据
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 配置请求头信息
		header: {
			'content-type': 'application/json;charset=UTF-8'
		},
	});
	// 请求拦截部分，如配置，每次请求前都会执行
	Vue.prototype.$u.http.interceptor.request = (config) => {
		const token = uni.getStorageSync('token');
		if (token) config.header.Authorization ='Bearer '+token;
		return config;
	}
	// 响应拦截，如配置，每次请求结束都会执行本方法
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if (res.code == 200) {
			return res;
		} else if (res.code == 401) {
			vm.$u.toast('验证失败，请重新登录');
			setTimeout(() => {
				vm.$u.route('/pages/login/login')
			}, 1500)
			return false;
		} else {
			return false;
		}
	}
}

export default {
	install
}
