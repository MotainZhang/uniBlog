// 定义不需要永久存储的目录，即下次APP启动数据会自动清空，值为在modules目录下的文件名
let notSaveStateKeys = ['$error'];


/* 以下代码请勿改动，除非你知道改动带来的效果 */
const modules = {};

let lifeData = uni.getStorageSync('lifeData') || {};
// #ifdef VUE2
const modulesFiles = require.context('./modules', true, /\.js$/);
modulesFiles.keys().map((modulePath, index) => {
	let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
	modules[moduleName] = modulesFiles(modulePath).default;
});
// #endif

// #ifdef VUE3
const modulesFiles = import.meta.globEager('./modules/*.js');
for (const modulePath in modulesFiles) {
	const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
	modules[moduleName] = modulesFiles[modulePath].default;
}
// #endif


for(let moduleName in modules){
	if(notSaveStateKeys.indexOf(moduleName) === -1) {
		if(!lifeData[moduleName]) lifeData[moduleName] = {};
	}
}

uni.setStorageSync('lifeData', lifeData);

// 保存变量到本地存储中
const saveLifeData = function(key, value){
	// 判断变量名是否在需要存储的数组中
	if(notSaveStateKeys.indexOf(key) === -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules,
	// 如果是开发环境,则开启严格模式
	strict: process.env.NODE_ENV === 'development',
	// 公共 mutations
	mutations: {
		updateStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			if(typeof payload.value === "undefined") payload.value = "";
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if(len >= 2) {
				let obj = state[nameArr[0]];
				for(let i = 1; i < len - 1; i ++) {
					let keyName = nameArr[i];
					if(typeof obj[keyName] !== "object") obj[keyName] = {};
					obj = obj[keyName];
				}
				obj[nameArr[len - 1]] = JSON.parse(JSON.stringify(payload.value));
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = JSON.parse(JSON.stringify(payload.value));
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})
// #endif

// #ifdef VUE3
import { createStore } from 'vuex'
const store = createStore({
	modules,
	// 如果是开发环境,则开启严格模式
	strict: process.env.NODE_ENV === 'development',
	// 公共 mutations
	mutations: {
		updateStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			if(typeof payload.value === "undefined") payload.value = "";
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if(len >= 2) {
				let obj = state[nameArr[0]];
				for(let i = 1; i < len - 1; i ++) {
					let keyName = nameArr[i];
					if(typeof obj[keyName] !== "object") obj[keyName] = {};
					obj = obj[keyName];
				}
				obj[nameArr[len - 1]] = JSON.parse(JSON.stringify(payload.value));
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = JSON.parse(JSON.stringify(payload.value));
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	}
})
// #endif

export default store