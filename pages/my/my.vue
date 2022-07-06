<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @click="editUser">
			<view class="u-m-r-10" style="margin-top: 20rpx;">
				<u-avatar :src="userDetail.avatar" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ userDetail.nickname }}</view>
				<view class="u-font-14 u-tips-color">{{ userDetail.username }}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- #ifndef MP-WEIXIN -->
				<u-cell-item icon="star" title="讨论" @click="gochat"></u-cell-item>
				<!-- #endif -->
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="coupon" title="搜索" @click="goSearch"></u-cell-item>
				<u-cell-item icon="heart" title="源码">
					<uni-link href="https://github.com/MotainZhang/uniBlog"></uni-link>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="退出" @click="exit"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				userDetail: {}
			};
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				vk.userCenter.getCurrentUserInfo({
					success: (data) => {
						// 成功后的逻辑
						this.userDetail = data.userInfo
					}
				});
			},
			editUser() {
				uni.navigateTo({
					url: '/subPackages/editUser/editUser'
				});
			},
			gochat() {
				uni.navigateTo({
					url: '/subPackages/tags/tags'
				});
			},
			goSearch() {
				uni.navigateTo({
					url: '/subPackages/search/search'
				});
			},
			exit() {
				vk.userCenter.logout({
					success: (data) => {
						// 退出登录成功后的逻辑
						uni.clearStorageSync();
						this.$u.route('/pages/login/login');
					}
				});

			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}
</style>
