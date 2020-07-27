<template>
	<view class="content">
	
		<scroll-view class="scroll" scroll-y>
			<view class="scroll-content">
				<view class="introduce-section">
					<text class="title">{{detailData.title}}</text>
					<view class="introduce">
						<text>{{detailData.author}}</text>
						<text>105阅读</text>
						<text>{{detailData.time}}</text>
					</view>
					
					<rich-text :nodes="detailData.flow"></rich-text>
					
					<view class="actions" v-show="loading === false">
						<view class="action-item">
							<text class="yticon icon-dianzan-ash"></text>
							<text>75</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-dianzan-ash reverse"></text>
							<text>6</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-fenxiang2"></text>
							<text>分享</text>
						</view>
						<view class="action-item">
							<text class="yticon icon-shoucang active"></text>
							<text>收藏</text>
						</view>
					</view>
				</view>
				
				<view class="container" v-show="loading === false">
					<!-- 推荐 -->
					<view class="s-header">
						<text class="tit">相关推荐</text>
					</view>
					<view class="rec-section" v-for="item in newsList" :key="item.id">
						<view class="rec-item">
							<view class="left">
								<text class="title">{{item.title}}</text>
								<view class="bot">
									<text class="author">{{item.author}}</text>
									<text class="time">{{item.time}}</text>
								</view>
							</view>
							<view class="right" v-if="item.images.length > 0">
								<image class="img" :src="item.images[0]" mode="aspectFill"></image>
							</view>
						</view>
					</view>
					
					<!-- 评论 -->
					<view class="s-header">
						<text class="tit">网友评论</text>
					</view>
					<view class="evalution">
						<view  v-for="(item, index) in evaList" :key="index"
							class="eva-item"
						>
							<image :src="item.src" mode="aspectFill"></image>
							<view class="eva-right">
								<text>{{item.nickname}}</text>
								<text>{{item.time}}</text>
								<view class="zan-box">
									<text>{{item.zan}}</text>
									<text class="yticon icon-shoucang"></text>
								</view>
								<text class="content">{{item.content}}</text>
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
				<input 
					class="input"
					type="text" 
					placeholder="点评一下把.." 
					placeholder-style="color:#adb1b9;"
				/>
			</view>
			<text class="confirm-btn">提交</text>
		</view>
	</view>
</template>

<script>
	import json from '@/json';
	import mixLoading from '@/components/mix-loading/mix-loading';
	export default {
		components: {
			mixLoading
		},
		data() {
			return {
				loading: true,
				detailData: {},
				newsList: [],
				evaList: [],
			}
		},
		onLoad(options){
			this.detailData = JSON.parse(options.data);
			this.loadNewsList();
			this.loadEvaList();
		},
		methods: {
			//获取推荐列表
			async loadNewsList(){
				let list = await json.newsList;
				setTimeout(()=>{
					list.sort((a,b)=>{
						return Math.random() > .5 ? -1 : 1; //静态数据打乱顺序
					})
					list.length = 5;
					list.forEach(item=>{
						this.newsList.push(item);
					})
					
					this.detailData.flow = `<div style="font-size:15px;color: #555;line-height: 25px"><h1 style="margin: 0px; font-weight: normal; font-size: 26px; font-family: 微软雅黑; text-align: center; line-height: 30px; white-space: normal; background-color: rgb(255, 255, 255);"><br/></h1><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;"><img style="width: 100%;max-width: 100% !important;" src="http://app.shundecity.com/data/upload/yangtata/20190414/1555206583915888.jpg" border="0" hspace="0" vspace="0" data-bd-imgshare-binded="1" style="margin: 0px; padding: 0px; border: none; max-width: 90%;"/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;">市委常委、顺德区委书记郭文海赴勒流调研。<br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; text-align: center;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　昨日（4月13日），市委常委、顺德区委书记郭文海利用周末时间到勒流街道江村、黄连社区调研村级工业园改造、乡村振兴工作。郭文海表示，村级工业园改造和城乡形态提升是勒流目前面临的两大任务，要下定决心以城产人融合标准做好村级工业园连片改造的规划，健全生态体系建设；文化振兴是乡村振兴战略的源头活水，勒流要挖掘弘扬乡村民俗文化，为乡村振兴战略提供坚实的文化支撑，同时要充分发挥党建引领作用，广泛发动群众参与社区营造，自己家园自己建，打造美丽文明乡村。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　勒流今年以五金创新小镇·滨水生态区、中部产业园及富安工业区为着力点，重点推进龙眼、江村、新安三个村级工业园区的改造，吸引优质产业集聚，打造南、中、北三大产业集中布局组团，借助村级工业园改造的契机，让勒流的产业布局和城市面貌得到优化和提升。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　其中，江村工业区计划由改造方分单元进行连片改造，以绿色环保为导向，突出智能制造，打造“环境科技产业基地”；新安工业区初步划分为东、中、西三个改造区域，通过“退二进三”，建设集居住、商业、娱乐于一体的生活服务区，为富安工业区及周边村居提供配套设施服务。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　郭文海表示，勒流位于顺德的地理中心，是顺德的腹地，且工业基础雄厚，工业产值在顺德镇街中排名第三，发展潜力巨大，在村级工业园改造升级过程中，要下定决心做好连片改造的规划，腾出空间完善城市配套，以城产人融合标准健全生态体系建设，形成经济效益、生态效益、社会效益的三重丰收，为进驻企业提供优质的工作生活环境。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　古韵绵绵，河水潺潺，组成一幅优美的岭南水乡画卷。在千年古村黄连，文化营造和水乡生态修复、乡土美食推广、民宿建设构成了黄连振兴乡村，建设美丽文明村居的四大发展思路。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　郭文海参观了画家艺术村、藩侯何公祠、广绣坊。目前，黄连画家艺术村设有8个入驻画家工作室和10个流动流动艺术家创作驿站，画家村艺术活动非常活跃；黄连广绣作为顺德的传统文化和国家级非物质文化遗产，如今在黄连广绣坊开展有师资培训班、绣娘屋、亲子夏令营、广绣传承进校园等活动，激活、创新广绣技艺。值得一提的是，黄连社区把“厕所革命”与生态文明建设有机结合，优化提升人居环境和文旅公共服务水平。</p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;"><br/></p><p style="margin-top: 0px; margin-bottom: 0px; padding: 0px;">　　郭文海分别与画家村驻村画家及广绣坊学员亲切交流，并“点赞”黄连社区乡村振兴工作的开展成效。郭文海表示，文化振兴是乡村振兴战略的源头活水，千年古村黄连拥有深厚的民俗文化底蕴，需要挖掘、弘扬和发扬光大，将黄连的民俗文化做成黄连特色，必然会为乡村振兴提供坚实的文化支撑；同时，黄连的乡村振兴工作也离不开党建引领和社区营造，要充分发挥党建引领作用，广泛发动群众参与社区营造，自己家园自己建，打造“近者悦，远者来”的美丽文明乡村。（姚易　通讯员顺宣）</p><p><br/></p></div>`;
					this.loading = false;
				}, 1000)
			},
			//获取评论列表
			async loadEvaList(){
				this.evaList = await json.evaList;
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.content{
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
	}
	.video-wrapper{
		height: 422upx;
		
		.video{
			width: 100%;
			height: 100%;
		}
	}
	.scroll{
		flex: 1;
		position: relative;
		background-color: #f8f8f8;
		height: 0;
	}
	.scroll-content{
		display: flex;
		flex-direction: column;
	}
	/* 简介 */
	.introduce-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		line-height: 1.5;
		
		.title{
			font-size: 36upx;
			color: #303133;
			margin-bottom: 16upx;
		}
		.introduce{
			display: flex;
			font-size: 26upx;
			color: #909399;
			text{
				margin-right: 16upx;
			}
		}
	}
	/* 点赞等操作 */
	.actions{
		display: flex;
		justify-content: space-around;
		align-items: center;
		line-height: 1.3;
		padding: 10upx 40upx 20upx;
	
		.action-item{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 24upx;
			color: #999;
		}
		.yticon{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 52upx;
			
			&.reverse{
				position: relative;
				top: 6upx;
				transform: scaleY(-1);
			}
			&.active{
				color: #ec706b;
			}
		}
		.icon-fenxiang2{
			font-weight: bold;
			font-size: 36upx;
		}
		.icon-shoucang{
			font-size: 44upx;
		}
	}

	.s-header{
		padding: 20upx 30upx;
		font-size: 30upx;
		color: #303133;
		background: #fff;
		margin-top: 16upx;
		
		&:before{
			content: '';
			width: 0;
			height: 40upx;
			margin-right: 24upx;
			border-left: 6upx solid #ec706b;
		}
	}
	/* 推荐列表 */
	.rec-section{
		background-color: #fff;
		.rec-item{
			display: flex;
			padding: 20upx 30upx;
			position: relative;
			&:after{
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
		.left{
			flex: 1;
			padding-right: 10upx;
			overflow: hidden;
			position: relative;
			padding-bottom: 52upx;
			.title{
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 32upx;
				color: #303133;
				line-height: 44upx;
			}
			.bot{
				position: absolute;
				left: 0;
				bottom: 4upx;
				font-size: 26upx;
				color: #909399;
			}
			.time{
				margin-left: 20upx;
			}
		}
		.right{
			width: 220upx;
			height: 140upx;
			flex-shrink: 0;
			position: relative;
			.img{
				width: 100%;
				height: 100%;
			}
			
		}
	}
	/* 评论 */
	.evalution{
		display:flex;
		flex-direction:column;
		background: #fff;
		padding: 20upx 0;
	}
	
	.eva-item{
		display:flex;
		padding: 20upx 30upx;
		position: relative;
		image{
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 24upx;
		}
		&:after{
			content: '';
			position: absolute;
			left: 30upx;
			bottom: 0;
			right: 0;
			height: 0;
			border-bottom: 1px solid #eee;
			transform: translateY(50%);
		}
		&:last-child:after{
			border: 0;
		}
	}
	.eva-right{
		display:flex;
		flex-direction:column;
		flex: 1;
		font-size: 26upx;
		color: #909399;
		position:relative;
		.zan-box{
			display:flex;
			align-items:base-line;
			position:absolute;
			top: 10upx;
			right: 10upx;
			.yticon{
				margin-left: 8upx; 
			}
		}
		.content{
			font-size: 28upx;
			color: #333;
			padding-top:20upx;
		}
	}
	
	/* 底部 */
	.bottom{
		flex-shrink: 0;
		display: flex;
		align-items: center;
		height: 90upx;
		padding: 0 30upx;
		box-shadow: 0 -1px 3px rgba(0,0,0,.04); 
		position: relative;
		z-index: 1;
		
		.input-box{
			display: flex;
			align-items: center;
			flex: 1;
			height: 60upx;
			background: #f2f3f3;
			border-radius: 100px;
			padding-left: 30upx;
			
			.icon-huifu{
				font-size: 28upx;
				color: #909399;
			}
			.input{
				padding: 0 20upx;
				font-size: 28upx;
				color: #303133;
			}
		}
		.confirm-btn{
			font-size: 30upx;
			padding-left: 20upx;
			color: #0d9fff;
		}
	}
</style>
