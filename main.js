import App from './App'
import store from './store'
import config from '@/app.config.js'

// 引入 uView UI
import uView from './uni_modules/vk-uview-ui';
// 引入 vk框架前端
import vk from './uni_modules/vk-unicloud';
// #ifndef VUE3
import Vue from 'vue'

// 引入 uView UI
Vue.use(uView);

// 引入 vk框架前端
Vue.use(vk);

// 初始化 vk框架
Vue.prototype.vk.init({
  Vue,               // Vue实例
  config,	           // 配置
});

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
});

app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app  = createSSRApp(App)
  
  // 引入vuex
  app.use(store)
  
  // 引入 uView UI
  // app.use(uView)
  
  // 引入 vk框架前端
  app.use(vk);
  
  // 初始化 vk框架
  app.config.globalProperties.vk.init({
    Vue: app,          // Vue实例
    config,	           // 配置
  });
  
  return { app }
}
// #endif