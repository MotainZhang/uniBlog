export default function(Vue){
  // #ifndef VUE3
	Vue.prototype.$hasPermission = function hasPermission(name) {
		const permission = this.$store.state.$user.permission || []
		return permission.indexOf(name) > -1
	}
	Vue.prototype.$hasRole = function hasRole(name) {
		const role = this.$store.state.$user.userInfo.role || []
		return role.indexOf(name) > -1
	}
  // #endif
  
  // #ifdef VUE3
  Vue.config.globalProperties.$hasPermission = function hasPermission(name) {
  	const permission = this.$store.state.$user.permission || []
  	return permission.indexOf(name) > -1
  }
  Vue.config.globalProperties.$hasRole = function hasRole(name) {
  	const role = this.$store.state.$user.userInfo.role || []
  	return role.indexOf(name) > -1
  }
   // #endif
}