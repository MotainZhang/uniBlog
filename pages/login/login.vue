<template>
	<view class="login">
		<u-toast ref="uToast" />
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput v-model="loginForm.username" type="text" maxlength="11" placeholder="用户名"></wInput>
				<wInput v-model="loginForm.password" type="password" maxlength="11" placeholder="密码"></wInput>
			</view>
			<wButton class="wbutton" text="登 录" :rotate="isRotate" @click.native="startLogin()"></wButton>
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue'; //input
	import wButton from '../../components/watch-login/watch-button.vue'; //button

	export default {
		data() {
			return {
				//logo图片 base64
				logoImage: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/ea0131e5-70ff-48d3-a5c4-73b4d1d08170.png",
				loginForm: {
					agreement: true,
					username: 'admin',
					password: '123456'
				},
				isRotate: false //是否加载旋转
			};
		},
		components: {
			wInput,
			wButton
		},
		onShow() {
			// #ifdef MP-WEIXIN  
			if (wx.hideHomeButton) {
				wx.hideHomeButton();
			}
			// #endif
		},
		mounted() {
			_this = this;
		},
		methods: {
			startLogin() {
				//登录
				let that = this;
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				this.isRotate = true;
				vk.userCenter.login({
					data: this.loginForm,
					//loading:false,
					success: (data) => {
						console.log("data", data);
						uni.setStorageSync("userId", data.uid)
						uni.setStorageSync("userName", data.userInfo.nickname)
						setTimeout(() => {
							// 跳转到首页,或页面返回
							that.login_success(data);
						}, 1000);
					}
				})
				this.isRotate = false;
			},
			login_success(data) {
				let that = this;
				that.isRotate = false
				// 检查是否有指定跳转的页面
				if (vk.navigate.originalPage) {
					vk.navigate.originalTo();
					return false;
				}
				// 跳转到首页,或页面返回
				var pages = getCurrentPages();
				console.log(pages.length, pages[pages.length - 1].route);
				if (pages.length > 1 &&
					pages[pages.length - 2] &&
					pages[pages.length - 2].route &&
					pages[pages.length - 2].route.indexOf('login/index') == -1
				) {
					const eventChannel = that.getOpenerEventChannel();
					eventChannel.emit('loginSuccess', {});
					vk.navigateBack();
				} else {
					// 进入首页
					vk.navigateToHome();
				}
			},
		}
	};
</script>

<style>
	@import url('../../components/watch-login/css/icon.css');
	@import url('./css/main.css');
</style>
