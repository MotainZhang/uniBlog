<template>
	<view>
		<u-swiper :list="list" duration="3000" :effect3d="true"></u-swiper>
		<view class="content">
			<u-tabs ref="tabs" name="_id" count="count" :list="tabList" bar-height="6" bar-width="40" :offset="[2,5]"
				:current="current" @change="tabsChange"></u-tabs>
			<u-card class="articleItem" v-for="(item, index) in articleList" :padding="10" :key="index"
				:title="item.title" :title-size="30" :sub-title="item.subTitle" :box-shadow="cardShadow">
				<view class="" slot="body" @click="goArticleDetail(item)">
					<view class="article-detail">
						<u-parse :html="item.content"></u-parse>
					</view>
				</view>
				<view class="" slot="foot">
					<view class="list-item-others">
						<u-icon name="chat-fill" size="34" color="" :label="calcComments(item.comments)"></u-icon>
						<u-icon name="eye-fill" size="34" color="" :label="item.viewCount.toString()"></u-icon>
						<text class="splitLine"></text>
						<u-icon name="tags-fill" size="34" color=""></u-icon>
						<u-tag style="margin-left: 10rpx;" v-for="(tag, tagIndex) in item.tags" :key="tagIndex"
							color="#fff" :border-color="tag.color" :bg-color="tag.color" :text="tag.name"
							:size="tagSize" />
						<text class="splitLine"></text>
						<u-icon name="bookmark-fill" size="34" color=""></u-icon>
						<u-tag style="margin-left: 10rpx;" v-for="(category, categoryIndex) in item.categories"
							:key="category.name" color="#fff" :border-color="category.color" :bg-color="category.color"
							:text="category.name" :size="tagSize" />
					</view>
				</view>
			</u-card>
			<u-back-top :scrollTop="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
			<u-loadmore :status="status" icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		calcCommentsCount
	} from '../../untils/index.js';
	export default {
		data() {
			return {
				list: [{
						image: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/a268f292-6738-44ec-8372-22010a7d8748.webp',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/b12fec87-3e5c-4bd8-bdda-7e2b5331b5db.webp',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/a268f292-6738-44ec-8372-22010a7d8748.webp',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				cardShadow: "rgba(0, 0, 0, 0.16) 0px 2px 5px 0px, rgba(0, 0, 0, 0.16) 0px 2px 5px 0px",
				tagSize: 'mini',
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				page: 1,
				pageSize: 3,
				articleList: [],
				scrollTop: 0,
				mode: 'square',
				iconStyle: {
					fontSize: '32rpx',
					color: '#2979ff'
				},
				tabList: [],
				current: 0,
				currentTagName: ''
			};
		},
		onReady() {

		},
		onShow() {
			this.page = 1;
			this.status = 'loading';
			this.getTabsList()
		},
		onLoad() {

		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			this.status = 'loading';
			this.page = ++this.page;
			const queryParams = {
				page: this.page,
				pageSize: this.pageSize,
				tag: this.currentTagName
			};
			this.getArticleList()
		},
		methods: {
			getTabsList() {
				vk.callFunction({
					url: 'client/tag/kh/tagCoutByName',
					title: '',
					data: {},
				}).then(res => {
					if (res.code == 0) {
						this.tabList = res.rows;
						this.currentTagName = res.rows[0]['_id']
						this.getArticleList()
					}
				});
			},
			tabsChange(index) {
				console.log("index", index)
				this.articleList = []
				this.current = index
				this.page = 1;
				this.currentTagName = this.tabList[index]['_id']
				this.getArticleList()
			},
			getArticleList() {
				const queryParams = {
					pageIndex: this.page,
					pageSize: this.pageSize,
					tag: this.currentTagName
				};
				vk.callFunction({
					url: 'client/article/kh/getList',
					title: '',
					data: queryParams,
				}).then(res => {
					if (res.code == 0) {
						if (res.rows.length == 0) {
							this.status = 'nomore';
							this.page = --this.page;
						} else {
							this.status = 'loadmore';
							this.articleList = [...this.articleList, ...res.rows];
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
			goArticleDetail(item) {
				this.$u.route({
					url: 'subPackages/articleDetail/articleDetail',
					params: {
						id: item._id
					}
				});
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
<style scoped>
	.slot-wrap {
		width: 100%;
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		/* flex: 1; */
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;
	}
</style>
