<template>
	<view class="register">
		<u-toast ref="uToast" />
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput v-model="registerData.username" type="text" maxlength="11" placeholder="用户名"></wInput>
				<wInput v-model="registerData.password" type="password" maxlength="11" placeholder="密码" isShowPass>
				</wInput>
				<wInput v-model="registerData.confirm" type="password" maxlength="11" placeholder="确认密码" isShowPass>
				</wInput>
			</view>
			<wButton class="wbutton" text="注 册" :rotate="isRotate" @click.native="startReg()"></wButton>
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
				logoImage: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/ea0131e5-70ff-48d3-a5c4-73b4d1d08170.png',
				registerData: {
					confirm: '',
					password: '',
					username: ''
				},
				showAgree: true, //协议是否选择
				isRotate: false //是否加载旋转
			};
		},
		components: {
			wInput,
			wButton
		},
		mounted() {
			_this = this;
		},
		methods: {
			startReg() {
				//注册
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (!this.registerData.username) {
					vk.toast('请填写用户名', "none");
					return false;
				}
				let pattern = /^[a-zA-Z0-9_-]{4,16}$/;
				if (!pattern.test(this.registerData.username)) {
					vk.toast('用户名是由4-16位字母数字下划线减号组成', "none");
					return false;
				}
				if (!this.registerData.password) {
					vk.toast('请填写密码', "none");
					return false;
				}
				if (!this.registerData.confirm) {
					vk.toast('请确认密码', "none");
					return false;
				}
				if (this.registerData.password != this.registerData.confirm) {
					vk.toast('两次输入密码不一致', "none");
					return false;
				}
				_this.isRotate = true;
				vk.userCenter.register({
					data: this.registerData,
					success: (data) => {
						// 注册成功后的逻辑
						this.isRotate = false;
						uni.reLaunch({
							url: '/pages/my/editUser'
						});
					}
				})
			}
		},
	}
</script>

<style>
	@import url('../../components/watch-login/css/icon.css');
	@import url('./css/main.css');
</style>
