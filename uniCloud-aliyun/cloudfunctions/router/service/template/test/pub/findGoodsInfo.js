module.exports = {
	/**
	 * 此函数名称
	 * @url template/test/pub/findGoodsInfo 前端调用的url参数地址
	 * data 请求参数 说明
	 * @params {String} uid  当前登录用户id,若用户已登录且token有效,则data中会带uid参数
	 * (此参数是后端过滤器通过token获取并添加到data中的,是可信任的)(只有kh函数才带此参数)
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = { code : 0, msg : '' };
		// 业务逻辑开始----------------------------------------------------------- 
		// 可写与数据库的交互逻辑等等
		let { goods_id } = data;
		/**
		 * 这里本来是需要从数据库中获取的,这里简化一下,直接返回数据了
		 * 正常业务中,是需要连表查询的,分别是订单表和SKU表 双表连接查询出最终返回给前端的数据
		 */
		let goodsDB = [
			{
				"_id":"001",
				"name": "iphone11",
				"goods_thumb":"https://img14.360buyimg.com/n0/jfs/t1/59022/28/10293/141808/5d78088fEf6e7862d/68836f52ffaaad96.jpg",
				"sku_list": [
					{
						"_id": "001",
						"goods_id": "001",
						"goods_name": "iphone11",
						"image": "https://img14.360buyimg.com/n0/jfs/t1/79668/22/9987/159271/5d780915Ebf9bf3f4/6a1b2703a9ed8737.jpg",
						"price": 19800,
						"sku_name": "红色,128G,公开版",
						"sku_name_arr": ["红色", "128G", "公开版"],
						"stock": 100
					},
					{
						"_id": "002",
						"goods_id": "001",
						"goods_name": "iphone11",
						"image": "https://img14.360buyimg.com/n0/jfs/t1/52252/35/10516/124064/5d7808e0E46202391/7100f3733a1c1f00.jpg",
						"price": 9800,
						"sku_name": "白色,256G,公开版",
						"sku_name_arr": ["白色", "256G","公开版"],
						"stock": 100
					},
					{
						"_id": "003",
						"goods_id": "001",
						"goods_name": "iphone11",
						"image": "https://img14.360buyimg.com/n0/jfs/t1/79668/22/9987/159271/5d780915Ebf9bf3f4/6a1b2703a9ed8737.jpg",
						"price": 19800,
						"sku_name": "红色,256G,公开版",
						"sku_name_arr": ["红色","256G","公开版"],
						"stock": 100
					}
				],
				"spec_list": [
					{
						"list": [
							{
								"name": "红色"
							},
							{
								"name": "黑色"
							},
							{
								"name": "白色"
							}
						],
						"name": "颜色"
					},
					{
						"list": [
							{
								"name": "128G"
							},
							{
								"name": "256G"
							}
						],
						"name": "内存"
					},
					{
						"list": [
							{
								"name": "公开版"
							},
							{
								"name": "非公开版"
							}
						],
						"name": "版本"
					}
				]
			},
			{
				"_id":"002",
			  "name": "迪奥香水",
				"goods_thumb":"https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			  "sku_list": [
			    {
			      "_id": "004",
			      "goods_id": "002",
			      "goods_name": "迪奥香水",
			      "image": "https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			      "price": 19800,
			      "sku_name": "50ml/瓶",
			      "sku_name_arr": ["50ml/瓶"],
			      "stock": 100
			    },
			    {
			      "_id": "005",
			      "goods_id": "002",
			      "goods_name": "迪奥香水",
			      "image": "https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			      "price": 9800,
			      "sku_name": "70ml/瓶",
			      "sku_name_arr": ["70ml/瓶"],
			      "stock": 100
			    }
			  ],
			  "spec_list": [
			    {
			      "list": [
			        {
			          "name": "20ml/瓶"
			        },
			        {
			          "name": "50ml/瓶"
			        },
			        {
			          "name": "70ml/瓶"
			        }
			      ],
			      "name": "规格"
			    }
			  ]
			},
			{
				"_id":"003",
			  "name": "迪奥香水",
				"goods_thumb":"https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			  "sku_list": [
			    {
			      "_id": "006",
			      "goods_id": "003",
			      "goods_name": "迪奥香水",
			      "image": "https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			      "price": 19800,
			      "sku_name": "默认",
			      "sku_name_arr": ["默认"],
			      "stock": 100
			    }
			  ],
			  "spec_list": [
			    {
			      "list": [
			        {
			          "name": "默认"
			        }
			      ],
			      "name": "默认"
			    }
			  ]
			},
			{
				"_id":"004",
			  "name": "迪奥香水",
				"goods_thumb":"https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			  "sku_list": [
			    {
			      "_id": "006",
			      "goods_id": "003",
			      "goods_name": "迪奥香水",
			      "image": "https://res.lancome.com.cn/resources/2020/9/11/15998112890781924_920X920.jpg?version=20200917220352530",
			      "price": 19800,
			      "sku_name": "默认",
			      "sku_name_arr": ["默认"],
			      "stock": 0
			    }
			  ],
			  "spec_list": [
			    {
			      "list": [
			        {
			          "name": "默认"
			        }
			      ],
			      "name": "默认"
			    }
			  ]
			}
		];
		res.goodsInfo = vk.pubfn.getListItem(goodsDB, "_id",goods_id);
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}