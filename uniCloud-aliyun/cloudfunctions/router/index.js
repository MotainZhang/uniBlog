'use strict';
// 注意：此为云函数路由入口文件，请勿修改此文件代码，你自己的云函数逻辑应写在service目录下
const vk = require('vk-unicloud');              // vk-unicloud 工具包
vk.init(require('./config.js'));
exports.main = async (event, context) => {
	return await vk.router({ event, context, vk });
};