<template>
	<view class="qiun-columns">
		<view class="qiun-charts">
			<!--#ifdef MP-ALIPAY -->
			<canvas
				canvas-id="canvasWord"
				id="canvasWord"
				class="charts"
				:width="cWidth * pixelRatio"
				:height="cHeight * pixelRatio"
				:style="{ width: cWidth + 'px', height: cHeight + 'px' }"
				@touchstart="touchWord"
			></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasWord" id="canvasWord" class="charts" @touchstart="touchWord"></canvas>
			<!--#endif-->
		</view>
		<view class="comment">
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
			stateTab:true
		};
	},
	onShow(){
		if (this.stateTab) {
			this.getServerData();
			this.getComment()
		}
		this.stateTab = true;
	},
	onLoad() {
		this.getServerData();
		this.getComment()
		this.stateTab = false;
	},
	methods: {
		// 获取非文章详情页评论
		getComment() {
			this.$u.get(`/blog/article/-1`).then(res => {
				if (res.code == 200) {
					this.commentList = res.data.comments;
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
			this.$u.get(`/blog/category/list`).then(res => {
				if (res.code == 200) {
					res.data.forEach((item, index) => {
						item.textSize = this.$u.random(20, 40);
					});
					this.chartData.series = res.data;
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
