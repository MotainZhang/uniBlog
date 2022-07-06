<template>
	<view class="wrap">
		<view class="comment" v-for="(res, index) in commentList" :key="res.id">
			<view class="left">
				<u-avatar :src="res.user.avatar"></u-avatar>
			</view>
			<view class="right">
				<view class="top">
					<view class="name">{{ res.user.username }}</view>
					<view class="like" :class="{ highlight: res.isLike == 1 }">
						<view class="num">{{ res.likeNum }}</view>
						<u-icon v-if="res.isLike == 0" name="thumb-up" :size="30" color="#9a9a9a" @click="getLike(res)">
						</u-icon>
						<u-icon v-if="res.isLike == 1" name="thumb-up-fill" :size="30" @click="getLike(res)"></u-icon>
					</view>
				</view>
				<view class="content">{{ res.content }}</view>
				<view class="reply-box">
					<view class="item" v-for="(item, index) in res.replies" :key="item.index">
						<view class="username">{{ item.user.username }}</view>
						<view class="text">{{ item.content }}</view>
					</view>
					<view class="all-reply" @tap="toAllReply(res)" v-if="res.replies != undefined">
						共{{ res.replies.length }}条回复
						<u-icon class="more" name="arrow-right" :size="res.replies.length"></u-icon>
					</view>
				</view>
				<view class="bottom">
					{{ res._add_time_str }}
					<view class="reply" @click="toggleMask('show', res)">回复</view>
				</view>
			</view>
		</view>
		<zjsComment ref="zjsComment" :placeholder="'发布评论'" @pubComment="pubComment"></zjsComment>
	</view>
</template>

<script>
	import zjsComment from '@/components/comment/zjs-comment.vue';
	export default {
		name: 'comment',
		components: {
			zjsComment
		},
		data() {
			return {};
		},
		props: {
			commentList: Array | [],
			articleId: Number | String
		},
		onLoad() {},
		methods: {
			// 跳转到全部回复
			toAllReply(comment) {
				uni.navigateTo({
					url: '/pages/comment/reply?comment=' + encodeURIComponent(JSON.stringify(comment))
				});
			},
			// 点赞
			getLike(item) {
				let userId = uni.getStorageSync('userId');
				item.isLike == 1 ? (item.isLike = 0) : (item.isLike = 1);
				if (item.isLike == 1) {
					item.likeNum++;
					if (item.likeUserIds) {
						item.likeUserIds = item.likeUserIds.toString();
						if (item.likeUserIds.indexOf(userId) == -1) {
							if (this.endsWith(item.likeUserIds, ',')) {
								item.likeUserIds = item.likeUserIds + userId;
							} else {
								item.likeUserIds = item.likeUserIds + ',' + userId;
							}
						}
					} else {
						item.likeUserIds = userId;
					}
				} else {
					if (item.likeNum > 0) {
						item.likeNum--;
						if (item.likeUserIds) {
							item.likeUserIds = item.likeUserIds.toString();
							if (item.likeUserIds.indexOf(userId) != -1) {
								item.likeUserIds = item.likeUserIds.replace(userId, '');
							}
						}
					}
				}
				vk.callFunction({
						url: 'client/comment/kh/updateComment',
						title: '',
						data: {
							_id: item._id,
							isLike: item.isLike,
							likeNum: item.likeNum,
							likeUserIds: item.likeUserIds
						},
					})
					.then(res => {
						if (res.code == 200) {}
					});
			},
			toggleMask(type, item) {
				this.commentId = item._id;
				this.$refs.zjsComment.toggleMask(type);
			},
			pubComment(commentContent1) {
				let params = {
					isLike: 0,
					likeNum: 0,
					articleId: this.articleId,
					commentId: this.commentId,
					content: commentContent1,
				};
				vk.callFunction({
						url: 'client/reply/kh/addReply',
						title: '',
						data: params
					}).then(res => {
					if (res.code == 0) {
						this.$refs.zjsComment.toggleMask();
						this.$refs.zjsComment.content = '';
						this.$emit('refreshList');
					}
				});
			},
			endsWith(str, split) {
				return str.slice(-split.length) == split;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.comment {
		display: flex;
		padding: 30rpx 0;

		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}

		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					color: #5677fc;
				}

				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;

					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}
				}

				.highlight {
					color: #5677fc;

					.num {
						color: #5677fc;
					}
				}
			}

			.content {
				margin-bottom: 10rpx;
			}

			.reply-box {
				background-color: rgb(242, 242, 242);
				border-radius: 12rpx;

				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;

					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}

				.all-reply {
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;

					.more {
						margin-left: 6rpx;
					}
				}
			}

			.bottom {
				margin-top: 20rpx;
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
