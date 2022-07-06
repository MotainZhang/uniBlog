<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo">
						<image :src="comment.user.avatarUrl" mode=""></image>
					</view>
					<view class="user-info">
						<view class="name">{{ comment.user.username }}</view>
						<view class="date">{{ comment.createdAt }}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: comment.isLike == 1 }">
					{{ comment.likeNum }}
					<u-icon v-if="comment.isLike == 0" name="thumb-up" class="like" color="#9a9a9a" :size="30"
						@click="getLike"></u-icon>
					<u-icon v-if="comment.isLike == 1" name="thumb-up-fill" class="like" :size="30" @click="getLike">
					</u-icon>
				</view>
			</view>
			<view class="content">{{ comment.content }}</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.replies.length }}）</view>
			<view class="item" v-for="(item, index) in comment.replies" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo">
								<image :src="item.user.avatarUrl" mode=""></image>
							</view>
							<view class="user-info">
								<view class="name">{{ item.user.username }}</view>
								<view class="date">{{ item.createdAt }}</view>
							</view>
						</view>
						<view class="right" :class="{ highlight: item.isLike == 1 }">
							<view class="num">{{ item.likeNum }}</view>
							<u-icon v-if="item.isLike == 0" name="thumb-up" class="like" :size="30" color="#9a9a9a"
								@click="getLike(index)"></u-icon>
							<u-icon v-if="item.isLike == 1" name="thumb-up-fill" class="like" :size="30"
								@click="getLike(index)"></u-icon>
						</view>
					</view>
					<view class="content">{{ item.content }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				comment: {}
			};
		},
		onLoad(option) {
			let comment = JSON.parse(decodeURIComponent(option.comment));
			this.comment = comment;
		},
		methods: {
			// 点赞
			getLike(index) {
				if (index === 0 || index > 0) {
					this.comment.replies[index].isLike == 1 ? (this.comment.replies[index].isLike = 0) : (this.comment
						.replies[index].isLike = 1);
					if (this.comment.replies[index].isLike == 1) {
						this.comment.replies[index].likeNum++;
						this.commitLike(1, this.comment.replies[index], 0);
					} else {
						if (this.comment.replies[index].likeNum > 0) {
							this.comment.replies[index].likeNum--;
							this.commitLike(0, this.comment.replies[index], 0);
						}
					}
				} else {
					this.comment.isLike == 1 ? (this.comment.isLike = 0) : (this.comment.isLike = 1);
					if (this.comment.isLike == 1) {
						this.comment.likeNum++;
						this.commitLike(1, this.comment, 1);
					} else {
						if (this.comment.likeNum > 0) {
							this.comment.likeNum--;
							this.commitLike(0, this.comment, 1);
						}
					}
				}
			},
			// 评论点赞
			commitLike(isLike, comment, type) {
				let userId = uni.getStorageSync('userId');
				if (isLike == 1) {
					if (comment.likeUserIds) {
						comment.likeUserIds = comment.likeUserIds.toString();
						if (comment.likeUserIds.indexOf(userId) == -1) {
							if (this.endsWith(comment.likeUserIds, ',')) {
								comment.likeUserIds = comment.likeUserIds + userId;
							} else {
								comment.likeUserIds = comment.likeUserIds + ',' + userId;
							}
						}
					} else {
						comment.likeUserIds = userId;
					}
				} else {
					if (comment.likeUserIds) {
						comment.likeUserIds = comment.likeUserIds.toString();
						if (comment.likeUserIds.indexOf(userId) != -1) {
							comment.likeUserIds = comment.likeUserIds.replace(userId, '');
						}
					}
				}
				let params = {
					replyId: comment.id,
					id: comment.id,
					isLike: comment.isLike,
					likeNum: comment.likeNum,
					userId: userId,
					likeUserIds: comment.likeUserIds
				};
				if (type == 1) {
					delete params.replyId;
				}
				vk.callFunction({
					url: 'client/comment/kh/updateComment',
					title: '',
					data: params
				}).then(res => {
					if (res.code == 200) {}
				});
			},
			endsWith(str, split) {
				return str.slice(-split.length) == split;
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #f2f2f2;
	}

	.comment {
		padding: 30rpx;
		font-size: 32rpx;
		background-color: #ffffff;

		.top {
			display: flex;
			justify-content: space-between;
		}

		.left {
			display: flex;

			.heart-photo {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}

			.user-info {
				margin-left: 10rpx;

				.name {
					color: #5677fc;
					font-size: 28rpx;
					margin-bottom: 4rpx;
				}

				.date {
					font-size: 20rpx;
					color: $u-light-color;
				}
			}
		}

		.right {
			display: flex;
			font-size: 20rpx;
			align-items: center;
			color: #9a9a9a;

			.like {
				margin-left: 6rpx;
			}

			.num {
				font-size: 26rpx;
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

	.all-reply {
		margin-top: 10rpx;
		padding-top: 20rpx;
		background-color: #ffffff;

		.all-reply-top {
			margin-left: 20rpx;
			padding-left: 20rpx;
			border-left: solid 4rpx #5677fc;
			font-size: 30rpx;
			font-weight: bold;
		}

		.item {
			border-bottom: solid 2rpx $u-border-color;
		}

		.reply {
			padding: 20rpx;
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			margin: 10rpx 0;

			.username {
				font-size: 24rpx;
				color: #7a7a7a;
			}
		}
	}
</style>
