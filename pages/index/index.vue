<template>
	<view class="content">
		<w-loading text="加载中.." mask="true" click="true" ref="loading"></w-loading>
		<u-card v-if="loading" class="articleItem" v-for="(item, index) in articleList" :key="index" :title="item.title" :title-size="40" :sub-title="item.subTitle">
			<view class="" slot="body" @click="goArticleDetail(item)"><view class="article-detail" v-html="tranferHtml(item.content)"></view></view>
			<view class="" slot="foot">
				<view class="list-item-others">
					<u-icon name="chat-fill" size="34" color="" :label="calcComments(item.comments)"></u-icon>
					<u-icon name="eye-fill" size="34" color="" :label="item.viewCount.toString()"></u-icon>
					<text class="splitLine"></text>
					<u-icon name="tags-fill" size="34" color=""></u-icon>
					<u-tag
						style="margin-left: 10rpx;"
						v-for="(tag, tagIndex) in item.tags"
						:key="tagIndex"
						color="#fff"
						:border-color="tag.color"
						:bg-color="tag.color"
						:text="tag.name"
						@click="goTagSelect(tag, 'tag')"
					/>
					<text class="splitLine"></text>
					<u-icon name="bookmark-fill" size="34" color=""></u-icon>
					<u-tag
						style="margin-left: 10rpx;"
						v-for="(category, categoryIndex) in item.categories"
						:key="category.name"
						color="#fff"
						:border-color="category.color"
						:bg-color="category.color"
						:text="category.name"
						@click="goTagSelect(category, 'category')"
					/>
				</view>
			</view>
		</u-card>
		<u-back-top :scrollTop="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
		<u-loadmore v-if="loading" :status="status" icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
import { translateMarkdown, calcCommentsCount } from '../../untils/index.js';
export default {
	data() {
		return {
			loading: false,
			status: 'loadmore',
			iconType: 'flower',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			page: 1,
			articleList: [],
			scrollTop: 0,
			mode: 'square',
			iconStyle: {
				fontSize: '32rpx',
				color: '#2979ff'
			},
			stateTab: true
		};
	},
	onReady() {
		this.$refs.loading.open();
	},
	onShow() {
		if (this.stateTab) {
			this.articleList = []
			this.getArticleList();
		}
		this.stateTab = true;
	},
	onLoad() {
		this.getArticleList();
		this.stateTab = false;
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		this.status = 'loading';
		this.page = ++this.page;
		this.$u.api.getArticleList({ page: this.page, pageSize: 10 }).then(res => {
			if (res.code == 200) {
				if (res.data.rows.length == 0) {
					this.status = 'nomore';
				} else {
					this.status = 'loadmore';
					this.articleList = [...this.articleList, ...res.data.rows];
					this.articleList.forEach((item, index) => {
						item.tags.forEach((item1, index1) => {
							item1.color = this.getRandomColor();
						});
						item.categories.forEach((item2, index2) => {
							item2.color = this.getRandomColor();
						});
					});
				}
			}
		});
	},
	methods: {
		getArticleList() {
			this.status = 'loading';
			this.$u.api.getArticleList({ pageSize: 10 }).then(res => {
				if (res.code == 200) {
					this.articleList = res.data.rows;
					this.articleList.forEach((item, index) => {
						item.tags.forEach((item1, index1) => {
							item1.color = this.getRandomColor();
						});
						item.categories.forEach((item2, index2) => {
							item2.color = this.getRandomColor();
						});
					});
					this.$refs.loading.close();
					this.loading = true;
				}
			});
		},
		goTagSelect(item, type) {
			this.$u.route({
				url: 'pages/archives/archivesSelect',
				params: {
					name: item.name,
					type: type
				}
			});
		},
		goArticleDetail(item) {
			this.$u.route({
				url: 'pages/articleDetail/articleDetail',
				params: {
					id: item.id
				}
			});
		},
		tranferHtml(content) {
			if (content) {
				return translateMarkdown(content);
			}
		},
		calcComments(count) {
			return calcCommentsCount(count).toString();
		},
		getRandomColor() {
			return '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6);
		}
	}
};
</script>
<style scoped></style>
