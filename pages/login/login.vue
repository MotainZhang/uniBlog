<template>
	<view class="login">
		<u-toast ref="uToast" />
		<view class="content">
			<!-- 头部logo -->
			<view class="header"><image :src="logoImage"></image></view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput v-model="phoneData" type="text" maxlength="11" placeholder="用户名"></wInput>
				<wInput v-model="passData" type="password" maxlength="11" placeholder="密码"></wInput>
			</view>
			<wButton class="wbutton" text="登 录" :rotate="isRotate" @click.native="startLogin()"></wButton>

			<!-- 其他登录 -->
			<!-- <view class="other_login cuIcon">
				<view class="login_icon"><view class="cuIcon-weixin" @tap="login_weixin"></view></view>
				<view class="login_icon"><view class="cuIcon-weibo" @tap="login_weibo"></view></view>
				<view class="login_icon"><view class="cuIcon-github" @tap="login_github"></view></view>
			</view> -->

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
			logoImage:"../../static/img/logoImg.png",
			phoneData: '', //用户/电话
			passData: '', //密码
			isRotate: false //是否加载旋转
		};
	},
	components: {
		wInput,
		wButton
	},
	onShow() {
		// #ifdef MP-WEIXIN  
		if(wx.hideHomeButton){  
		    wx.hideHomeButton();  
		}  
		// #endif
	},
	mounted() {
		_this = this;
		this.isLogin();
	},
	methods: {
		isLogin() {
			//判断缓存中是否登录过，直接登录
			try {
				const value = uni.getStorageSync('userId');
				if (value) {
					//有登录信息
					console.log('已登录用户：', value);
					uni.reLaunch({
						url: '/pages/index/index'
					});
				}
			} catch (e) {
				// error
			}
		},
		startLogin() {
			//登录
			if (this.isRotate) {
				//判断是否加载中，避免重复点击请求
				return false;
			}
			if (this.phoneData.length == '') {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '用户名不能为空'
				});
				return;
			}
			if (this.passData.length == 0) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '密码不正确'
				});
				return;
			}
			this.isRotate = true;
			this.$u.api
				.login({ account: this.phoneData, password: this.passData })
				.then(res => {
					if (res.code == 200) {
						this.isRotate = false;
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('userId', res.data.userId);
						uni.setStorageSync('userName', res.data.username);
						uni.reLaunch({
							url: '/pages/index/index'
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
		},
		login_weixin() {
			//微信登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '...'
			});
		},
		login_weibo() {
			//微博登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '...'
			});
		},
		login_github() {
			//github登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '...'
			});
		}
	}
};
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
