<template>
	<view class="app-article content">
		<w-loading text="加载中.." mask="true" click="true" ref="loading"></w-loading>
		<view class="post-header" v-if="loading">
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
					<u-tag
						style="margin-left: 10rpx;"
						v-for="(tag, tagIndex) in articleDetail.tags"
						:key="tagIndex"
						color="#fff"
						size="mini"
						:border-color="tag.color"
						:bg-color="tag.color"
						:text="tag.name"
						@click="goTagSelect(tag,'tag')"
					/>
					<text class="splitLine"></text>
					<u-icon name="bookmark-fill" size="34" color=""></u-icon>
					<u-tag
						style="margin-left: 10rpx;"
						v-for="(tag, tagIndex) in articleDetail.categories"
						:key="tag.name"
						color="#fff"
						size="mini"
						:border-color="tag.color"
						:bg-color="tag.color"
						:text="tag.name"
						@click="goTagSelect(tag,'category')"
					/>
					<text class="splitLine"></text>
					<u-icon name="chat-fill" size="34" color="" :label="calcComments(articleDetail.comments)"></u-icon>
					<u-icon name="eye-fill" size="34" color="" :label="articleDetail.viewCount ? articleDetail.viewCount.toString() : 0"></u-icon>
				</view>
			</view>
		</view>
		<view v-if="loading" class="article-detail" v-html="tranferHtml(articleDetail.content)"></view>
		<view class="comment" v-if="loading">
			<u-form :model="commentForm" ref="commentForm" label-width="0">
				<u-form-item><u-input type="textarea" :border="true" :autoHeight="true" v-model="commentForm.content" /></u-form-item>
			</u-form>
			<u-button type="primary" @click="commentSubmit">提交评论</u-button>
			<comment :commentList="commentList" :articleId="articleId" @refreshList="refreshList"></comment>
		</view>
	</view>
</template>
<script>
import comment from '../comment/index.vue';
import { translateMarkdown, calcCommentsCount } from '../../untils/index.js';
export default {
	components: {
		comment
	},
	data() {
		return {
			loading: false,
			articleDetail: {},
			commentList: [],
			articleId: '',
			commentForm: {
				content: ''
			}
		};
	},
	onReady() {
		this.$refs.loading.open();
	},
	onLoad(option) {
		this.articleId = option.id;
		this.$u.get(`/blog/article/${option.id}`).then(res => {
			if (res.code == 200) {
				this.articleDetail = res.data;
				this.commentList = res.data.comments;
				this.articleDetail.tags.forEach((item, index) => {
					item.color = this.getRandomColor();
				});
				this.articleDetail.categories.forEach((item, index) => {
					item.color = this.getRandomColor();
				});
				this.$refs.loading.close();
				this.loading = true;
			}
		});
	},
	methods: {
		goTagSelect(item,type) {
			this.$u.route({
				url: 'pages/archives/archivesSelect',
				params: {
					name: item.name,
					type:type
				}
			});
		},
		// 更新评论列表
		refreshList(commentList) {
			this.commentList = commentList;
		},
		//提交评论
		commentSubmit() {
			let params = {
				isLike:0,
				likeNum:0,
				articleId: this.articleId,
				content: this.commentForm.content,
				userId: uni.getStorageSync('userId')
			};
			this.$u.post('/blog/discuss', params).then(res => {
				if (res.code == 200) {
					this.commentList = res.data.rows;
					this.commentForm.content = '';
				}
			});
		},
		tranferHtml(content) {
			if (content) {
				return translateMarkdown(content);
			}
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
