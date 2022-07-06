<template>
	<view class="qiun-columns">
		<view class="qiun-charts">
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasWord" id="canvasWord" class="charts" :width="cWidth * pixelRatio"
				:height="cHeight * pixelRatio" :style="{ width: cWidth + 'px', height: cHeight + 'px' }"
				@touchstart="touchWord"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasWord" id="canvasWord" class="charts" @touchstart="touchWord"></canvas>
			<!--#endif-->
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="comment">
			<u-form :model="commentForm" ref="commentForm" label-width="0">
				<u-form-item>
					<u-input type="textarea" :border="true" :autoHeight="true" v-model="commentForm.content" />
				</u-form-item>
			</u-form>
			<u-button type="primary" @click="commentSubmit">提交评论</u-button>
			<comment :commentList="commentList" :articleId="articleId" @refreshList="refreshList"></comment>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import comment from '../comment/index.vue';
	import uCharts from '../../js_sdk/u-charts/u-charts.min.js';
	var _self;
	var canvaWord = null;
	export default {
		components: {
			comment
		},
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				chartData: {
					series: []
				},
				commentList: [],
				articleId: -1,
				commentForm: {
					content: ''
				},
			};
		},
		onShow() {
			
		},
		onLoad() {
			this.getServerData();
			this.getComment();
		},
		methods: {
			// 获取非文章详情页评论
			getComment() {
				let userId = uni.getStorageSync('userId');
				vk.callFunction({
					url: 'client/comment/kh/getComment',
					title: '',
					data: {
						articleId: -1,
					},
				}).then(res => {
					if (res.code == 0) {
						this.commentList = res.rows;
						this.commentList.forEach((item, index) => {
							if (item.likeUserIds) {
								item.likeUserIds = item.likeUserIds.toString();
								if (item.likeUserIds.indexOf(userId) != -1) {
									item.isLike = 1;
								}
							}
							if (item.replies.length > 0) {
								item.replies.forEach((replyItem, index) => {
									if (replyItem.likeUserIds) {
										replyItem.likeUserIds = replyItem.likeUserIds.toString();
										if (replyItem.likeUserIds.indexOf(userId) != -1) {
											replyItem.isLike = 1;
										}
									}
								});
							}
						});
					}
				});
			},
			// 更新评论列表
			refreshList() {
				this.getComment();
			},
			//提交评论
			commentSubmit() {
				let params = {
					isLike: 0,
					likeNum: 0,
					articleId: Number(this.articleId),
					content: this.commentForm.content,
				};
				vk.callFunction({
					url: 'client/comment/kh/addComment',
					title: '',
					data: params,
				}).then(res => {
					if (res.code == 0) {
						this.getComment()
					}
				});
			},
			getServerData() {
				_self = this;
				//#ifdef MP-ALIPAY
				uni.getSystemInfo({
					success: function(res) {
						if (res.pixelRatio > 1) {
							//正常这里给2就行，如果pixelRatio=3性能会降低一点
							//_self.pixelRatio =res.pixelRatio;
							_self.pixelRatio = 2;
						}
					}
				});
				//#endif
				this.cWidth = uni.upx2px(750);
				this.cHeight = uni.upx2px(500);
				vk.callFunction({
					url: 'client/tag/kh/tagCoutByName',
					title: '',
					data: {},
				}).then(res => {
					if (res.code == 0) {
						res.rows.forEach((item, index) => {
							item.textSize = this.$u.random(20, 40)
							item.name = item._id
						});
						this.chartData.series = res.rows;
						this.textarea = JSON.stringify(this.chartData);
						this.showWord('canvasWord', this.chartData);
					}
				});
			},
			showWord(canvasId, chartData) {
				canvaWord = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'word',
					background: '#000000',
					animation: true,
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						word: {
							type: 'normal'
						}
					}
				});
			},
			touchWord(e) {
				canvaWord.showToolTip(e, {
					format: function(item) {
						return item.name;
					}
				});
			}
		}
	};
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #ffffff;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #ffffff;
		font-weight: ;
	}

	.comment {
		padding: 50rpx;
	}
</style>
