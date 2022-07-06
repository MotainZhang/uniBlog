<template>
	<view class="archivesContent">
		<u-time-line>
			<u-time-line-item nodeTop="2" v-if="articleList.length > 0">
				<template v-slot:node>
					<view class="u-node" style="background: #19be6b;">
						<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
					</view>
				</template>
				<template v-slot:content>
					<view>
						<view class="u-order-desc" style="color:#19be6b;font-size: 30rpx;">Nice! {{ articleCount }}
							posts in total. Keep on posting.</view>
					</view>
				</template>
			</u-time-line-item>
			<u-time-line-item v-for="(item, index) in articleList" :key="index">
				<template v-slot:node>
					<view class="u-sec-node" style="background:#1890ff;">
						<u-icon name="star-fill" color="#fff" :size="12"></u-icon>
					</view>
				</template>
				<template v-slot:content>
					<view>
						<view class="u-order-desc" @click="goArticleDetail(item)">{{ item.title }}</view>
						<view class="u-order-time">{{ item.createdAt }}</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>
		<u-back-top :scrollTop="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
		<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				page: 1,
				pageSize: 20,
				articleList: [],
				scrollTop: 0,
				mode: 'square',
				iconStyle: {
					fontSize: '32rpx',
					color: '#2979ff'
				},
				articleCount: 0,
				tagName: ''
			};
		},
		onShow() {
			
		},
		onReady() {

		},
		onLoad(option) {
			this.tagName = option.tag
			this.page = 1;
			this.getArchivesList();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.status = 'loading';
			this.page = ++this.page;
			this.getArchivesList()
		},
		methods: {
			getArchivesList() {
				this.status = 'loading';
				vk.callFunction({
					url: 'client/article/kh/getList',
					title: '',
					data: {
						pageIndex: this.page,
						pageSize: this.pageSize,
						tag: this.tagName
					},
				}).then(res => {
					if (res.code == 0) {
						if (res.rows.length == 0) {
							this.status = 'nomore';
							this.page = --this.page;
						} else {
							this.status = 'loadmore';
							this.articleList = [...this.articleList, ...res.rows];
							this.articleCount = res.total
						}

					}
				});
			},
			goArticleDetail(item) {
				this.$u.route({
					url: 'subPackages/articleDetail/articleDetail',
					params: {
						id: item._id
					}
				});
			}
		}
	};
</script>

<style scoped>
	.archivesContent {
		padding: 50rpx;
	}

	.u-sec-node {
		width: 25rpx;
		height: 25rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #1890ff;
	}

	.u-node {
		width: 50rpx;
		height: 50rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}

	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}

	.u-order-desc {
		color: #1890ff;
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
</style>
