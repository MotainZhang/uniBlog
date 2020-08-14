<!-- 发布朋友圈 -->
<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#f8f8f8' }" :border-bottom="false" back-icon-name="" back-text="取消" :back-text-style="{ color: '#404133' }">
			<view class="slot-wrap" slot="right"><u-button size="mini" type="success" @click="handleRelease" :disabled="$u.trim(this.content) ? false : true">发表</u-button></view>
		</u-navbar>
		<!-- #endif -->
		<textarea class="input" v-model="content" placeholder="这一刻的想法..." :show-confirm-bar="false" :adjust-position="false" :disable-default-padding="true"></textarea>
		<u-upload
			class="upload"
			multiple
			ref="upload"
			:form-data="upData"
			:action="action"
			:max-size="maxSize"
			:max-count="9"
			:size-type="['compressed']"
			@on-uploaded="onUploaded"
			@on-remove="onUpRemove"
		></u-upload>
	</view>
</template>

<script>
import json from '../../json.js';
export default {
	data() {
		return {
			content: '',
			action: json.imgConfig.action,
			maxSize: 2 * 1024 * 1024, //限制文件大小 2M
			btnLoading: false, //防止重复点击
			upData: {
				token: json.imgConfig.token
			},
			filesArr: []
		};
	},
	methods: {
		onUploaded(fileList) {
			this.filesArr = fileList;
		},
		onUpRemove(file, index, lists) {
			let fileId = file.response.id;
			this.$u
				.post('/blog/friend/delImage', {
					id: fileId,
					token: json.imgConfig.token,
					action: 'delete'
				})
				.then(res => {
					if (res.code == 200) {
					}
				});
		},
		//自定义标题栏按钮 h5&&app
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				this.handleRelease();
			}
		},
		//自定义标题栏按钮点击事件  微信小程序
		handleRelease() {
			if (this.$u.trim(this.content) || this.$refs.upload.lists.length) {
				this.btnLoading = true;
				uni.showLoading({
					title: '正在发布...',
					mask: true
				});
				let params = {
					id: this.$u.random(1, 9999),
					content: this.content,
					images: this.filesArr,
					userId: uni.getStorageSync('userId'),
					isPraise:0
				};
				this.$u.api.createFriend(params).then(res => {
					if (res.code == 200) {
						this.btnLoading = false;
						uni.hideLoading();
						this.$u.route({ type: 'back'});
					}
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	padding: 20rpx 40rpx;
	.input {
		caret-color: $uni-color-success;
		height: 160rpx;
		padding: 0 15rpx;
	}
	.tips {
		margin-top: 120rpx;
	}
}
</style>
<style lang="scss">
.content {
	.upload {
		/deep/.u-list-item,
		.u-add-wrap {
			background-color: #eceae8;
		}
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
	}
}
</style>
