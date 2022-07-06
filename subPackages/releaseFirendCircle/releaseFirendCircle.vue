<!-- 发布朋友圈 -->
<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#f8f8f8' }" :border-bottom="false" back-icon-name=""
			back-text="取消" :back-text-style="{ color: '#404133' }">
			<view class="slot-wrap" slot="right">
				<u-button size="mini" type="success" @click="handleRelease"
					:disabled="$u.trim(this.content) ? false : true">发表</u-button>
			</view>
		</u-navbar>
		<!-- #endif -->
		<textarea class="input" v-model="content" placeholder="这一刻的想法..." :show-confirm-bar="false"
			:adjust-position="false" :disable-default-padding="true"></textarea>
		<uni-file-picker v-model="imageValue" return-type="array" fileMediatype="image" mode="grid" :del-icon="false"
			@select="select" @progress="progress" @success="success" @fail="fail" />
	</view>
</template>

<script>
	// import json from '../../json.js';
	export default {
		data() {
			return {
				content: '',
				maxSize: 500 * 1024, //限制文件大小 500kb
				imageValue: []
			};
		},
		methods: {
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
                const fileSize = e.tempFiles[0].maxSize
				if(fileSize > this.maxSize){
					uni.showToast({
						icon:"error",
						title: '选择图片过大,请重新选择嗷！！！',
						duration: 2000
					});
					return false
				}
			},
			// 获取上传进度
			progress(e) {
				
			},

			// 上传成功
			success(e) {
				
			},

			// 上传失败
			fail(e) {
				uni.showToast({
					icon:"error",
					title: '哦豁,上传失败啦！！！',
					duration: 2000
				});
			},
			//自定义标题栏按钮 h5&&app
			onNavigationBarButtonTap({
				index
			}) {
				if (index == 0) {
					this.handleRelease();
				}
			},
			//自定义标题栏按钮点击事件  微信小程序
			handleRelease() {
				if (this.$u.trim(this.content)) {
					let params = {
						content: this.content,
						images: this.imageValue,
					};
					vk.callFunction({
						url: 'client/friendCircle/kh/addFriendCircle',
						title: '',
						data: params,
					}).then(res => {
						if (res.code == 0) {
							this.$u.route({
								type: 'back'
							});
						}
					});
				}else{
					uni.showToast({
						icon:"error",
						title: '世界这么大，说点什么吧！！！',
						duration: 2000
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
