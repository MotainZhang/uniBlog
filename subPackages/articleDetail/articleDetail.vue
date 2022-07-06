<template>
	<view class="app-article content">
		<view class="post-header">
			<view class="post-title">{{ articleDetail.title }}</view>
			<view class="article-desc">
				<view class="post-time">
					<u-icon name="star-fill" size="34" color=""></u-icon>
					&nbsp; Posted on &nbsp;
					<text class="time">{{ articleDetail.createdAt ? articleDetail.createdAt.slice(0, 10) : '' }}</text>
				</view>
				<view class="list-item-others">
					<text class="splitLine"></text>
					<u-icon name="tags-fill" size="34" color=""></u-icon>
					<u-tag style="margin-left: 10rpx;" v-for="(tag, tagIndex) in articleDetail.tags" :key="tagIndex"
						color="#fff" size="mini" :border-color="tag.color" :bg-color="tag.color" :text="tag.name"
						@click="goTagSelect(tag,'tag')" />
					<text class="splitLine"></text>
					<u-icon name="bookmark-fill" size="34" color=""></u-icon>
					<u-tag style="margin-left: 10rpx;" v-for="(tag, tagIndex) in articleDetail.categories"
						:key="tag.name" color="#fff" size="mini" :border-color="tag.color" :bg-color="tag.color"
						:text="tag.name" @click="goTagSelect(tag,'category')" />
					<text class="splitLine"></text>
					<u-icon name="chat-fill" size="34" color="" :label="calcComments(articleDetail.comments)"></u-icon>
					<u-icon name="eye-fill" size="34" color=""
						:label="articleDetail.viewCount ? articleDetail.viewCount.toString() : 0"></u-icon>
				</view>
			</view>
		</view>
		<view class="article-detail">
			<!-- #ifndef MP-WEIXIN -->
			<u-parse :html="articleDetail.content" :use-anchor="true" :tagStyle="tagStyle"></u-parse>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<rich-text :nodes="articleDetail.content"></rich-text>
			<!-- #endif -->
		</view>
		<view class="comment">
			<u-form :model="commentForm" ref="commentForm" label-width="0">
				<u-form-item>
					<u-input type="textarea" :border="true" :autoHeight="true" v-model="commentForm.content" />
				</u-form-item>
			</u-form>
			<u-button type="primary" @click="commentSubmit">提交评论</u-button>
			<comment :commentList="commentList" :articleId="articleId" @refreshList="refreshList"></comment>
		</view>
		<u-back-top :mode="mode" :scroll-top="scrollTop" :icon-style="iconStyle"></u-back-top>
	</view>
</template>
<script>
	import comment from '../comment/index.vue';
	import {
		calcCommentsCount
	} from '../../untils/index.js';
	export default {
		components: {
			comment
		},
		data() {
			return {
				mode: 'square',
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: '#2979ff'
				},
				articleDetail: {},
				commentList: [],
				articleId: '',
				commentForm: {
					content: ''
				},
				tagStyle: {
					img: 'height:200rpx'
				}
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReady() {

		},
		onLoad(option) {
			this.articleId = option.id;
			const queryParams = {
				pageIndex: 1,
				pageSize: 1,
				articleId: this.articleId
			};
			vk.callFunction({
				url: 'client/article/kh/getList',
				title: '',
				data: queryParams,
			}).then(res => {
				if (res.code == 0) {
					this.articleDetail = res.rows[0];
					// #ifdef MP-WEIXIN
					this.articleDetail.content = this.articleDetail.content
						.replace(/\<img/gi, '<img style="width:100%;height:200px"');
					// #endif
					this.getCommentList()
					this.articleDetail.tags.forEach((item, index) => {
						item.color = this.getRandomColor();
					});
					this.articleDetail.categories.forEach((item, index) => {
						item.color = this.getRandomColor();
					});
				}
			});
		},
		methods: {
			// 获取评论回复列表
			getCommentList() {
				vk.callFunction({
					url: 'client/comment/kh/getComment',
					title: '',
					data: {
						articleId: this.articleId
					},
				}).then(res => {
					if (res.code == 0) {
						this.commentList = res.rows;
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
			// 更新评论列表
			refreshList() {
				this.getCommentList()
			},
			//提交评论
			commentSubmit() {
				let params = {
					isLike: 0,
					likeNum: 0,
					articleId: this.articleId,
					content: this.commentForm.content,
				};
				vk.callFunction({
					url: 'client/comment/kh/addComment',
					title: '',
					data: params,
				}).then(res => {
					if (res.code == 0) {
						this.getCommentList()
						this.commentForm.content = '';
					}
				});
			},
			calcComments(count) {
				count = count ? count : [];
				return calcCommentsCount(count).toString();
			},
			getRandomColor() {
				return '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6);
			}
		}
	};
</script>

<style scoped></style>
