<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @click="editUser">
			<view class="u-m-r-10" style="margin-top: 20rpx;"><u-avatar :src="userDetail.avatarUrl" size="140"></u-avatar></view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ userDetail.username }}</view>
				<view class="u-font-14 u-tips-color">邮箱:{{ userDetail.email }}</view>
			</view>
			<view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="eye-fill" title="看一看" @click="goNews"></u-cell-item></u-cell-group>
		</view>
	<!-- 	<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view> -->
		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="setting" title="退出" @click="exit"></u-cell-item></u-cell-group>
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
		let userId = uni.getStorageSync('userId');
		this.$u
			.get('/blog/user/findById', {
				id: userId
			})
			.then(res => {
				if (res.code == 200) {
					this.userDetail = res.data;
				}
			});
	},
	methods: {
		goNews(){
			uni.navigateTo({
				url: '/pages/news/index'
			});
		},
		editUser() {
			uni.navigateTo({
				url: '/pages/my/editUser?userDetail=' + encodeURIComponent(JSON.stringify(this.userDetail))
			});
		},
		exit() {
			uni.clearStorageSync();
			this.$u.route('/pages/login/login');
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
