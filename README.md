## 主要功能

#### 1、登录，注册

#### 2、首页博客列表页可根据标签筛选，标签统计

#### 3、归档页所有博客文归档，历史查询

#### 4、发现页类似于朋友圈功能，点赞评论嗷

#### 5、个人中心页，可修改个人信息，搜索等等

## 快速上手 - 安装步骤

#### 正式安装

直接右键`uniCloud`目录 点击 `运行云服务空间初始化向导` 即可

## 前端（页面端）安装步骤

无需特别安装步骤，直接Hbuilder运行即可

## 云函数框架目录结构

<pre><a class="btn" data-clipboard-snippet="" data-toggle="popover" data-placement="bottom" data-content="" data-original-title="" title="">复制代码</a>`.
├── common─────────────────<span class="hljs-meta"># 自定义官方公共模块包</span>
│ └── config──────────────────<span class="hljs-meta"># 全局配置公共模块</span>
│ └── uni-id──────────────────<span class="hljs-meta"># uni-id官方公共模块</span>
│ └── vk-unicloud─────────────<span class="hljs-meta"># vk-unicloud公共模块</span>
├── router─────────────────<span class="hljs-meta"># 正式环境云函数主入口(函数路由器)</span>
│ └── dao──────────────────<span class="hljs-meta"># dao层(数据库交互公共API)</span>
│ └── middleware───────────<span class="hljs-meta"># 中间层(过滤器、拦截器)</span>
│ └── node_modules─────────<span class="hljs-meta"># npm包</span>
│ └── service──────────────<span class="hljs-meta"># 逻辑层(用于写业务逻辑)</span>
│ ── └── 逻辑层目录结构在下方单独展示
│ └── util─────────────────<span class="hljs-meta"># 工具包</span>
│ ── └── pubFunction.js───────<span class="hljs-meta"># 公共函数包</span>
│ ── └── smsUtil.js───────────<span class="hljs-meta"># 全局过滤器</span>
│ └── config.js────────────<span class="hljs-meta"># 入口函数初始化配置</span>
│ └── index.js─────────────<span class="hljs-meta"># 入口函数</span>
│ └── package.json─────────<span class="hljs-meta"># 第三方依赖配置文件(若使用npm，自动生成)</span>
└─└── package-<span class="hljs-keyword">lock</span>.json────<span class="hljs-meta"># 第三方依赖配置文件(若使用npm，自动生成)</span>
.
├── router-test───────────────<span class="hljs-meta"># 函数路由(开发测试环境)</span>
│ └── ...─────────<span class="hljs-meta"># ...</span>
│ └── ...─────────<span class="hljs-meta"># ...</span>
└── └── ...─────────<span class="hljs-meta"># ...</span>`</pre>

### 逻辑层目录结构

#### `router/service` 目录为逻辑层

#### 以下的目录并非强制性，只是建议，便于统一开发规范。

<pre><a class="btn" data-clipboard-snippet="" data-toggle="popover" data-placement="bottom" data-content="" data-original-title="" title="">复制代码</a>`.
├── service──────────────────────<span class="hljs-comment"># 逻辑层（用于写业务逻辑）</span>
│ └── admin────────────────<span class="hljs-comment"># 后台管理端逻辑（admin框架开发中。。。）</span>
│ ── └── xxxxxxxxxxxxxxx──────<span class="hljs-comment"># </span>
│ ── └── xxxxxxxxxxxxxxx──────<span class="hljs-comment"># </span>
│ ── └── xxxxxxxxxxxxxxx──────<span class="hljs-comment"># </span>
│ ── └── xxxxxxxxxxxxxxx──────<span class="hljs-comment"># </span>
│ └── client───────────────<span class="hljs-comment"># 客户端逻辑（H5、小程序、APP）</span>
│ ── └── user─────────────────<span class="hljs-comment"># 用户服务（自己系统的逻辑）</span>
│ ──── └── kh───────────────────<span class="hljs-comment"># kh函数为必须登录后才能访问的函数</span>
│ ──── └── pub──────────────────<span class="hljs-comment"># pub函数为所有人都可以访问,不限制</span>
│ ──── └── util─────────────────<span class="hljs-comment"># 用户服务专用的工具包</span>
│ ── └── order────────────────<span class="hljs-comment"># 订单服务（自己系统的逻辑）</span>
│ ──── └── kh───────────────────<span class="hljs-comment"># kh函数为必须登录后才能访问的函数</span>
│ ──── └── pub──────────────────<span class="hljs-comment"># pub函数为所有人都可以访问,不限制</span>
│ ──── └── util─────────────────<span class="hljs-comment"># 订单服务专用的工具包</span>
│ ── └── xxxxxxxxxxxxxxx──────<span class="hljs-comment"># </span>
│ ── └── xxxxxxxxxxxxxxx──────<span class="hljs-comment"># </span>
│ └── common───────────────<span class="hljs-comment"># 公共逻辑（公共接口）</span>
│ ── └── xxxxxxxxxxxxxxxx─────<span class="hljs-comment"># </span>
│ ── └── xxxxxxxxxxxxxxxx─────<span class="hljs-comment"># </span>
│ ── └── xxxxxxxxxxxxxxxx─────<span class="hljs-comment"># </span>
│ └── user─────────────────<span class="hljs-comment"># 统一用户中心服务(已集成uniID)（用户中心作为核心，且为了方便插件升级,故与admin和client平级）</span>
│ ── └── kh───────────────────<span class="hljs-comment"># kh函数为必须登录后才能访问的函数(客户端用户)</span>
│ ── └── pub──────────────────<span class="hljs-comment"># pub函数为所有人都可以访问,不限制</span>
│ ── └── sys──────────────────<span class="hljs-comment"># sys函数为后端管理人员才能访问的函数(商家后台工作人员)</span>
│ ── └── util─────────────────<span class="hljs-comment"># 统一用户中心服务专用的工具包</span>
│ └── plugs───────────────<span class="hljs-comment"># 插件逻辑（插件专用）（会陆续新增一些实用性插件给开发者使用，如微信小程序发送订阅消息等等）</span>
│ ──└── plugs-A───────────────────<span class="hljs-comment"># 插件A</span>
│ ────└── admin───────────────────<span class="hljs-comment"># 插件A admin端</span>
│ ────└── client──────────────────<span class="hljs-comment"># 插件A client端</span>
│ ──└── plugs-B───────────────────<span class="hljs-comment"># 插件B</span>
│ ────└── admin───────────────────<span class="hljs-comment"># 插件B admin端</span>
│ ────└── client──────────────────<span class="hljs-comment"># 插件B client端</span>
│ └── template─────────────<span class="hljs-comment"># 云函数模板（插件内的云函数写法模板）</span>
│ ── └── db_api───────────────<span class="hljs-comment"># 数据库接口调用模板</span>
│ └── muban.js─────────────<span class="hljs-comment"># 云函数模板（新建一个云函数应复制粘贴这个文件）</span>
│ └── muban_easy.js────────<span class="hljs-comment"># 云函数模板（简易版）</span>
└─────────────────────────────────`</pre>

扫描二维码快来体验吧

![体验二维码](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/432b9967-dc74-4f3f-abd6-1a69942de7aa.png)
![小程序体验二维码](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-0971f295-ba06-4d1c-8c5f-e03738f37c87/a84ca96c-98b6-4d1d-87bc-a88e32a6effc.jpg)

Github开源地址，觉得还可以给个小星星！！！！！后面更新新功能在这里嗷，另外unicloud版admin端正在开发中，期待一下吧。。。。。。
[uniBlogGitHub](https://github.com/MotainZhang/uniBlog)  

H5体验地址
[blog](https://static-0971f295-ba06-4d1c-8c5f-e03738f37c87.bspapp.com/zhangjsUni#/)

admin管理体验地址
[blog-admin](https://static-0971f295-ba06-4d1c-8c5f-e03738f37c87.bspapp.com/zhangjsAdmin/)

感谢Vk-unicloud-router作者
[Vk-unicloud-router](https://ext.dcloud.net.cn/plugin?id=2204)  

感谢uviewUI作者
[uviewUI](https://ext.dcloud.net.cn/plugin?id=1593)