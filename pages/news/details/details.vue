<template>
	<view class="content">
		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view id="article"><htmlParse :content="detailData.flow"></htmlParse></view>
				<view class="container" v-show="loading === false">
					<!-- 推荐 -->
					<view class="s-header"><text class="tit">相关推荐</text></view>
					<view class="rec-section" v-for="item in newsList" :key="item.id">
						<view class="rec-item">
							<view class="left">
								<text class="title">{{ item.title }}</text>
								<view class="bot">
									<text class="author">{{ item.author }}</text>
									<text class="time">{{ item.time }}</text>
								</view>
							</view>
							<view class="right" v-if="item.images.length > 0"><image class="img" :src="item.images[0]" mode="aspectFill"></image></view>
						</view>
					</view>

					<!-- 评论 -->
					<view class="s-header"><text class="tit">网友评论</text></view>
					<view class="evalution">
						<view v-for="(item, index) in evaList" :key="index" class="eva-item">
							<image :src="item.src" mode="aspectFill"></image>
							<view class="eva-right">
								<text>{{ item.nickname }}</text>
								<text>{{ item.time }}</text>
								<view class="zan-box">
									<text>{{ item.zan }}</text>
									<text class="yticon icon-shoucang"></text>
								</view>
								<text class="content">{{ item.content }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 加载图标 -->
				<mixLoading class="mix-loading" v-if="loading"></mixLoading>
			</view>
		</scroll-view>

		<view class="bottom">
			<view class="input-box">
				<text class="yticon icon-huifu"></text>
				<input class="input" type="text" placeholder="点评一下把.." placeholder-style="color:#adb1b9;" />
			</view>
			<text class="confirm-btn">提交</text>
		</view>
	</view>
</template>

<script>
import json from '@/json';
import mixLoading from '@/components/mix-loading/mix-loading';
import htmlParse from '@/components/html-parse/parse.vue';
export default {
	components: {
		mixLoading,
		htmlParse
	},
	data() {
		return {
			loading: true,
			detailData: {},
			newsList: [],
			evaList: []
		};
	},
	onLoad(options) {
		this.detailData = JSON.parse(options.data);
		this.loadNewsList();
		this.loadEvaList();
	},
	methods: {
		//获取推荐列表
		async loadNewsList() {
			this.$u.api.readerNews({ url: this.detailData.url }).then(res => {
				if (res.code == 200) {
					this.detailData.flow = res.data;
				}
			});
			let list = await json.newsList;
			setTimeout(() => {
				list.sort((a, b) => {
					return Math.random() > 0.5 ? -1 : 1; //静态数据打乱顺序
				});
				list.length = 5;
				list.forEach(item => {
					this.newsList.push(item);
				});
				this.loading = false;
			}, 1000);
		},
		//获取评论列表
		async loadEvaList() {
			this.evaList = await json.evaList;
		}
	}
};
</script>
<style lang="scss">
page {
	height: 100%;
}
.content {
	padding: 14upx;
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #fff;
}
.video-wrapper {
	height: 422upx;

	.video {
		width: 100%;
		height: 100%;
	}
}
.scroll {
	flex: 1;
	position: relative;
	height: 0;
}
.scroll-content {
	display: flex;
	flex-direction: column;
}
/* 简介 */
.introduce-section {
	display: flex;
	flex-direction: column;
	padding: 20upx 30upx;
	background: #fff;
	line-height: 1.5;

	.title {
		font-size: 36upx;
		color: #303133;
		margin-bottom: 16upx;
	}
	.introduce {
		display: flex;
		font-size: 26upx;
		color: #909399;
		text {
			margin-right: 16upx;
		}
	}
}
/* 点赞等操作 */
.actions {
	display: flex;
	justify-content: space-around;
	align-items: center;
	line-height: 1.3;
	padding: 10upx 40upx 20upx;

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #999;
	}
	.yticon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60upx;
		height: 60upx;
		font-size: 52upx;

		&.reverse {
			position: relative;
			top: 6upx;
			transform: scaleY(-1);
		}
		&.active {
			color: #ec706b;
		}
	}
	.icon-fenxiang2 {
		font-weight: bold;
		font-size: 36upx;
	}
	.icon-shoucang {
		font-size: 44upx;
	}
}

.s-header {
	padding: 20upx 30upx;
	font-size: 30upx;
	color: #303133;
	background: #fff;
	margin-top: 16upx;

	&:before {
		content: '';
		width: 0;
		height: 40upx;
		margin-right: 24upx;
		border-left: 6upx solid #ec706b;
	}
}
/* 推荐列表 */
.rec-section {
	background-color: #fff;
	.rec-item {
		display: flex;
		padding: 20upx 30upx;
		position: relative;
		&:after {
			content: '';
			position: absolute;
			left: 30upx;
			right: 0;
			bottom: 0;
			height: 0;
			border-bottom: 1px solid #eee;
			transform: scaleY(50%);
		}
	}
	.left {
		flex: 1;
		padding-right: 10upx;
		overflow: hidden;
		position: relative;
		padding-bottom: 52upx;
		.title {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			font-size: 32upx;
			color: #303133;
			line-height: 44upx;
		}
		.bot {
			position: absolute;
			left: 0;
			bottom: 4upx;
			font-size: 26upx;
			color: #909399;
		}
		.time {
			margin-left: 20upx;
		}
	}
	.right {
		width: 220upx;
		height: 140upx;
		flex-shrink: 0;
		position: relative;
		.img {
			width: 100%;
			height: 100%;
		}
	}
}
/* 评论 */
.evalution {
	display: flex;
	flex-direction: column;
	background: #fff;
	padding: 20upx 0;
}

.eva-item {
	display: flex;
	padding: 20upx 30upx;
	position: relative;
	image {
		width: 60upx;
		height: 60upx;
		border-radius: 50px;
		flex-shrink: 0;
		margin-right: 24upx;
	}
	&:after {
		content: '';
		position: absolute;
		left: 30upx;
		bottom: 0;
		right: 0;
		height: 0;
		border-bottom: 1px solid #eee;
		transform: translateY(50%);
	}
	&:last-child:after {
		border: 0;
	}
}
.eva-right {
	display: flex;
	flex-direction: column;
	flex: 1;
	font-size: 26upx;
	color: #909399;
	position: relative;
	.zan-box {
		display: flex;
		align-items: base-line;
		position: absolute;
		top: 10upx;
		right: 10upx;
		.yticon {
			margin-left: 8upx;
		}
	}
	.content {
		font-size: 28upx;
		color: #333;
		padding-top: 20upx;
	}
}

/* 底部 */
.bottom {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	height: 90upx;
	padding: 0 30upx;
	box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.04);
	position: relative;
	z-index: 1;

	.input-box {
		display: flex;
		align-items: center;
		flex: 1;
		height: 60upx;
		background: #f2f3f3;
		border-radius: 100px;
		padding-left: 30upx;

		.icon-huifu {
			font-size: 28upx;
			color: #909399;
		}
		.input {
			padding: 0 20upx;
			font-size: 28upx;
			color: #303133;
		}
	}
	.confirm-btn {
		font-size: 30upx;
		padding-left: 20upx;
		color: #0d9fff;
	}
}
</style>
