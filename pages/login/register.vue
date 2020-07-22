<template>
	<view class="register">
		<u-toast ref="uToast" />
		<view class="content">
			<!-- 头部logo -->
			<view class="header"><image :src="logoImage"></image></view>
			<!-- 主体 -->
			<view class="main">
				<wInput v-model="registerData.username" type="text" maxlength="11" placeholder="用户名"></wInput>
				<wInput v-model="registerData.password" type="password" maxlength="11" placeholder="密码" isShowPass></wInput>
				<wInput v-model="registerData.confirm" type="password" maxlength="11" placeholder="确认密码" isShowPass></wInput>
				<wInput v-model="registerData.email" type="text" placeholder="邮箱" isShowPass></wInput>
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
			logoImage: '../../static/img/logoImg.png',
			registerData: {
				confirm: '',
				email: '',
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
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '请填写用户名'
				});
				return false;
			}
			if (!this.registerData.password) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '请填写密码'
				});
				return false;
			}
			if (!this.registerData.confirm) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '请确认密码'
				});
				return false;
			}
			let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			if (!pattern.test(this.registerData.email)) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '请输入正确的邮箱'
				});
				return false;
			}
			_this.isRotate = true;
			this.$u.api
				.register(this.registerData)
				.then(res => {
					if (res.code == 200) {
						this.isRotate = false;
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				})
				.catch(e => {
					this.isRotate = false;
					this.$refs.uToast.show({
						title: e.message,
						type: 'error'
					});
				});
		}
	}
};
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
