<template>
	<view class="content" id="content">
		<u-notice-bar mode="horizontal" :list="noticeList"></u-notice-bar>
		<uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu"
			:direction="direction" @fabClick="linkToRelease"></uni-fab>
		<view class="content-circle">
			<view class="content-circle-box" v-for="(item, index) in circleData" :key="item.circleMegId">
				<view class="headimg">
					<image class="img" :src="item.user.avatar"></image>
				</view>
				<view class="content">
					<view class="content-name">{{ item.user.username }}</view>
					<view class="content-desc">{{ item.content }}</view>
					<view class="content-img" v-if="item.imageList.length">
						<!-- //只有一张图时候 -->
						<view v-if="item.imageList.length == 1">
							<image class="img-1" :src="item.imageList[0]" mode="widthFix"
								@tap="previewImg(0, item.imageList)"></image>
						</view>
						<!-- 有多张图的时候 -->
						<view v-else-if="item.imageList.length > 1">
							<view class="content-img-more">
								<image class="img-more" v-for="(src, index) in item.imageList" :key="index"
									:class="index % 3 == 0 && 'img-3'" :src="src" mode="aspectFill"
									@tap="previewImg(index, item.imageList)"></image>
							</view>
						</view>
					</view>
					<!-- 点赞评论按钮 -->
					<view class="relavivetime" :id="`comment-${'null'}-${index}`">
						<view class="time">{{ item._add_time_str }}</view>
						<view class="icon-box">
							<view @tap="clickThumb(item)">
								<image class="img icon-box-item thumb"
									:src="item.isPraise == 1 ? 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/aebade0d-fe5e-4c27-8c2d-a2b2c83be988.png' :'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/8d76c218-b547-43ee-9e32-0448e6bec1a8.png'"
									mode=""></image>
							</view>
							<view @tap="handleComment('show', item)">
								<image class="img icon-box-item"
									src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/8d76c218-b547-43ee-9e32-0448e6bec1a8.png"
									mode=""></image>
							</view>
						</view>
					</view>
					<!-- 点赞人 回复 -->
					<view class="msg-box">
						<view class="thumbinfo" v-if="item.friendLikes.length">
							<image class="thumbinfo-icon"
								src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/8d76c218-b547-43ee-9e32-0448e6bec1a8.png">
							</image>
							<text class="thumbinfo-name" v-for="(userInfo, index) in item.friendLikes"
								:key="userInfo.userId">
								{{ userInfo.userName }}{{ index != item.friendLikes.length - 1 ? '，' : '' }}
							</text>
						</view>
						<view class="comment" v-if="item.friendReplies.length">
							<view class="comment-box" v-for="(comment, index) in item.friendReplies" :key="index"
								hover-class="comment-hover-class" @tap="handleReply('show', comment)">
								<text class="comment-box-name"
									v-if="!comment.replyUserId">{{ comment.userName }}：</text>
								<text class="comment-box-name" v-if="comment.replyUserId">
									{{ comment.userName }}
									<text class="callback">回复</text>
								</text>
								<text v-if="comment.replyUserId"
									class="comment-box-name">{{ comment.replyUserName }}：</text>
								<text class="comment-box-content">{{ comment.content }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" />
		<zjsComment ref="zjsComment" :placeholder="placeholder" @pubComment="sendMsg"></zjsComment>
	</view>
</template>
<script>
	import zjsComment from '@/components/comment/zjs-comment.vue';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	export default {
		name: 'firendCircle',
		components: {
			uniFab,
			zjsComment
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				noticeList: ['请大家文明评论,谢谢啦!'],
				userId: '',
				userName: '',
				pattern: {},
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				placeholder: '发布评论',
				popMenu: false,
				show: false,
				content: '',
				circleData: [],
				commentMsg: {},
				type: 'commit'
			};
		},
		watch: {},
		onReady() {

		},
		onShow() {
			this.page = 1;
			this.circleData = [];
			this.userId = uni.getStorageSync('userId');
			this.userName = uni.getStorageSync('userName');
			this.getData();
		},
		onLoad() {

		},
		onReachBottom() {
			this.status = 'loading';
			this.page = ++this.page;
			this.getData()
		},
		methods: {
			//自定义标题栏按钮
			onNavigationBarButtonTap({
				index
			}) {
				if (index == 0) {
					//发布朋友圈
					this.$u.route('subPackages/releaseFirendCircle/releaseFirendCircle');
				} else if (index == 1) {
					//返回按钮
					this.$u.route({
						type: 'back'
					});
				}
			},
			//打开底部更换相册封面弹窗
			showSheet() {
				this.show = true;
			},
			//点赞
			clickThumb(item) {
				console.log(item)
				vk.callFunction({
						url: 'client/friendCircle/kh/addFriendLike',
						title: '',
						data: {
							uid: this.userId,
							friendId: item._id,
							userName: this.userName,
							isPraise: item.isPraise
						},
					})
					.then(res => {
						if (res.code == 0) {
							item.isPraise = item.isPraise == 0 ? 1 : 0
							this.getFriendById(item._id);
						}
					});
			},
			//点击评论
			handleComment(type, comment) {
				console.log(comment);
				this.type = 'comment';
				this.commentMsg = comment;
				this.content = '';
				this.placeholder = '评论：';
				this.$refs.zjsComment.toggleMask(type);
			},
			// 点击回复
			handleReply(type, comment) {
				console.log(comment);
				this.type = 'reply';
				this.commentMsg = comment;
				this.content = '';
				this.$refs.zjsComment.toggleMask(type);
				this.placeholder = `回复${comment.userName}:`;
			},
			//发送消息
			sendMsg(content) {
				if (!this.$u.trim(content)) {
					return;
				}
				let friendId;
				if (this.type == 'reply') {
					friendId = this.commentMsg.friendId
					this.commentMsg = {
						content: content,
						replyUserName: this.commentMsg.userName,
						replyUserId: this.commentMsg.userId,
						friendId: friendId,
						userId: this.userId,
						userName: this.userName
					};
				} else {
					friendId = this.commentMsg._id
					this.commentMsg = {
						content: content,
						replyUserName: null,
						replyUserId: null,
						friendId: this.commentMsg._id,
						userId: this.userId,
						userName: this.userName
					};
				}
				vk.callFunction({
					url: 'client/friendCircle/kh/addFriendComment',
					title: '',
					data: this.commentMsg,
				}).then(res => {
					if (res.code == 0) {
						this.$refs.zjsComment.toggleMask();
						this.$refs.zjsComment.content = '';
						this.getFriendById(friendId);
					}
				});
			},
			// 获取指定朋友圈数据局部刷新
			getFriendById(id) {
				vk.callFunction({
					url: 'client/friendCircle/kh/getFriendList',
					title: '',
					data: {
						friendId: id
					},
				}).then(res => {
					if (res.code == 0) {
						this.listParse(res.rows[0])
						this.circleData.forEach((item, index) => {
							if (item.id === res.rows[0].id) {
								this.circleData.splice(index, 1, res.rows[0])
								return
							}
						});
					}
				});
			},
			//查看大图
			previewImg(current, imgList) {
				uni.previewImage({
					current,
					urls: imgList,
					// #ifndef MP-WEIXIN
					indicator: 'number'
					// #endif
				});
			},
			getData() {
				vk.callFunction({
					url: 'client/friendCircle/kh/getFriendList',
					title: '',
					data: {
						pageIndex: this.page,
						pageSize: this.pageSize
					},
				}).then(res => {
					if (res.code == 0) {
						if (res.rows.length == 0) {
							this.status = 'nomore';
							this.page = --this.page;
						} else {
							this.status = 'loadmore';
							this.circleData = [...this.circleData, ...res.rows];
							this.circleData.forEach((item, index) => {
								if (typeof(item.images) == 'string') {
									item.imageList = item.images.split(',');
								} else {
									item.imageList = [];
								}
								item.isPraise = 0;
								// 如果点赞过 回显状态防止重复点赞
								item.friendLikes.forEach((likeItem, likeIndex) => {
									if (likeItem.uid == this.userId) {
										item.isPraise = 1;
									}
								});
							});
						}
					}
				});
			},
			// 列表数据处理
			listParse(item) {
				if (item.images) {
					item.imageList = item.images.split(',');
				} else {
					item.imageList = [];
				}
				item.isPraise = 0;
				// 如果点赞过 回显状态防止重复点赞
				item.friendLikes.forEach((likeItem, likeIndex) => {
					if (likeItem.uid == this.userId) {
						item.isPraise = 1;
					}
				});
			},
			//点击自定义组件相机按钮
			linkToRelease() {
				this.$u.route('subPackages/releaseFirendCircle/releaseFirendCircle');
			}
		},
		//下拉刷新
		async onPullDownRefresh() {
			await this.getData();
			uni.stopPullDownRefresh();
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.comment-hover-class {
		background-color: #f3dada;
	}

	image {
		will-change: transform;
	}

	.content {
		&-imgbox {
			position: relative;

			.bgimg {
				width: 100%;
				height: 560rpx;
			}

			.headimg {
				width: 110rpx;
				height: 110rpx;
				border-radius: 6rpx;
				position: absolute;
				right: 30rpx;
				bottom: -20rpx;
			}

			.nickname {
				color: #ffffff;
				position: absolute;
				right: 170rpx;
				bottom: 20rpx;
				font-size: 30rpx;
				font-weight: bold;
			}
		}

		&-circle {
			&-box {
				padding: 18rpx 30rpx;
				border-bottom: 1rpx solid #f2eeee;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: flex-start;

				.headimg {
					width: 80rpx;
					height: 80rpx;

					.img {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}

				.content {
					flex: 1;
					padding-left: 18rpx;
					font-size: 30rpx;

					&-name {
						color: #36648b;
					}

					&-desc {
						color: $u-main-color;
						padding-top: 6rpx;
						line-height: 34rpx;
					}

					&-img {
						margin-top: 10rpx;

						.img-1 {
							will-change: transform;
							width: 280rpx;
							height: auto;
							max-height: 400rpx;
						}

						&-more {
							display: flex;
							flex-wrap: wrap;

							.img-more {
								display: block;
								width: 160rpx;
								height: 160rpx;
								margin: 4rpx;
							}

							.img-3 {
								margin: 4rpx 4rpx 4rpx 0;
							}
						}
					}

					.msg-box {
						width: 100%;
						background-color: $u-type-error-light;
						margin-top: 15rpx;
						border-radius: 4rpx;

						.thumbinfo {
							// border-bottom: 1rpx solid gray;
							padding: 6rpx;
							display: flex;
							align-items: center;
							flex-wrap: wrap;

							&-icon {
								width: 28rpx;
								height: 28rpx;
								line-height: 28rpx;
								margin-right: 15rpx;
								text-align: center;
								vertical-align: middle;
								padding-left: 10rpx;
							}

							&-name {
								font-size: 28rpx;
								color: #36648b;
							}
						}

						.comment {
							padding: 6rpx 8rpx;
							color: $uni-text-color;
							font-size: 28rpx;

							&-box {
								padding: 4rpx 0;

								&-name {
									color: #36648b;

									.callback {
										color: $uni-text-color;
									}
								}

								&-content {
									word-break: break-all;
								}
							}
						}
					}
				}

				.relavivetime {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 26rpx;

					.time {
						color: $uni-text-color-grey;
					}

					.icon-box {
						display: flex;
						align-items: center;

						&-item {
							background-color: $u-type-error-light;
							padding: 4rpx 12rpx;
							border-radius: 6rpx;

							&.thumb {
								margin-right: 10rpx;
							}
						}

						.img {
							width: 34rpx;
							height: 34rpx;
						}
					}
				}
			}
		}

		.input-box {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			box-sizing: content-box;
			z-index: 999;
			background-color: #eaeaea;

			/* #ifdef MP-WEIXIN */
			padding-bottom: 0rpx;
			/* #endif */

			/* #ifndef MP-WEIXIN */
			margin-bottom: 0rpx;
			margin-bottom: constant(safe-area-inset-bottom);
			margin-bottom: env(safe-area-inset-bottom);

			/* #endif */
			&-flex {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: nowrap;
				flex-direction: row;
				padding: 0 20rpx;
				height: 100rpx;

				&-grow {
					flex-grow: 1;

					.content {
						background-color: #fff;
						height: 60rpx;
						padding: 0 20rpx;
						border-radius: 12rpx;
						font-size: 28rpx;
						caret-color: $uni-color-success;
					}
				}

				.btn {
					margin-left: 20rpx;
					background-color: $u-type-success;
					border: none;
				}
			}
		}

		.signature {
			display: flex;
			justify-content: flex-end;
			font-size: 24rpx;
			color: gray;
			padding: 35rpx 30rpx 35rpx 100rpx;
			text-align: right;
		}

		.slot-wrap {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
		}
	}
</style>
