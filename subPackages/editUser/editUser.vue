<template>
	<view class="container">
		<view class="ui-all">
			<view class="avatar" @tap="avatarChoose">
				<view class="imgAvatar">
					<view class="iavatar" :style="'background-image: url('+userDetail.avatar+');'">
					</view>
				</view>
				<text>修改头像</text>
			</view>
			<view class="ui-list">
				<text>昵称</text>
				<input type="text" placeholder="请输入昵称" :value="userDetail.nickname" @input="bindnickName"
					placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>性别</text>
				<u-radio-group v-model="userDetail.gender" @change="radioGroupChange">
					<u-radio @change="radioChange" v-for="(item, index) in sex" :key="index" :name="item.value">
						{{item.text}}
					</u-radio>
				</u-radio-group>
			</view>
			<button class="save" @tap="savaInfo">保 存</button>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				sex: [{
						"text": "未知",
						"value": 0
					},
					{
						"text": "男",
						"value": 1
					},
					{
						"text": "女",
						"value": 2
					}
				],
				userDetail: {
					nickname: '',
					avatar: '',
					gender: '',
					comment: ''
				},
			}
		},
		onShow() {

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
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			bindnickName(e) {
				this.userDetail.nickname = e.detail.value;
			},
			binddescription(e) {
				this.userDetail.comment = e.detail.value;
			},
			avatarChoose() {
				let that = this;
				if (this.userDetail.avatar) {
					vk.toast('你已经有头像啦！！！', "none");
					return;
				}
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						// tempFilePath可以作为img标签的src属性显示图片
						console.log(res)
						that.imgUpload(res);
					}
				});
			},
			savaInfo() {
				if (!this.userDetail.avatar) {
					vk.toast('请选择头像', "none");
					return;
				}
				if (!this.userDetail.nickname) {
					vk.toast('请填写昵称', "none");
					return;
				}
				if (!this.userDetail.gender) {
					vk.toast('请选择性别', "none");
					return;
				}
				vk.userCenter.updateUser({
					data: this.userDetail,
					success: (data) => {
						// 成功后的逻辑
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				});
			},
			imgUpload(file) {
				let that = this;
				vk.callFunctionUtil.uploadFile({
					title: "",
					filePath: file.tempFilePaths[0],
					suffix: file.tempFiles[0].type.split('/')[
						1], // 不传suffix会自动获取，但H5环境下获取不到后缀，但可以通过file.name 获取
					provider: "unicloud",
					success(res) {
						// 上传成功;
						that.userDetail.avatar = res.url;
					}
				});
			},

		},
	}
</script>

<style lang="less">
	.container {
		display: block;
	}

	.ui-all {
		padding: 20rpx 40rpx;

		.avatar {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			.imgAvatar {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;

				.iavatar {
					width: 100%;
					height: 100%;
					display: block;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					// background-color: #eee;
				}
			}

			text {
				display: inline-block;
				vertical-align: middle;
				color: #8e8e93;
				font-size: 28rpx;
				margin-left: 40rpx;
			}

			&:after {
				content: ' ';
				width: 20rpx;
				height: 20rpx;
				border-top: solid 1px #030303;
				border-right: solid 1px #030303;
				transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				/* IE 9 */
				-moz-transform: rotate(45deg);
				/* Firefox */
				-webkit-transform: rotate(45deg);
				/* Safari 和 Chrome */
				-o-transform: rotate(45deg);
				position: absolute;
				top: 85rpx;
				right: 0;
			}
		}

		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			text {
				color: #4a4a4a;
				font-size: 28rpx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150rpx;
			}

			input {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
			}

			button {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				background: none;
				margin: 0;
				padding: 0;

				&::after {
					display: none;
				}
			}

			picker {
				width: 90%;
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 30rpx;
				left: 150rpx;
			}

			textarea {
				color: #030303;
				font-size: 30rpx;
				vertical-align: middle;
				height: 150rpx;
				width: 100%;
				margin-top: 50rpx;
			}

			.place {
				color: #999999;
				font-size: 28rpx;
			}
		}

		.right:after {
			content: ' ';
			width: 20rpx;
			height: 20rpx;
			border-top: solid 1px #030303;
			border-right: solid 1px #030303;
			transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			/* IE 9 */
			-moz-transform: rotate(45deg);
			/* Firefox */
			-webkit-transform: rotate(45deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(45deg);
			position: absolute;
			top: 40rpx;
			right: 0;
		}

		.save {
			background: #030303;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 28rpx;
		}
	}
</style>
