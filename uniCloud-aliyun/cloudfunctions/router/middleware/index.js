// 加载模块 - 中间件 请勿改动此文件-----------------------------------
const modulesPath = __dirname+"/modules";
const fs = require('fs');
const fileList = fs.readdirSync(modulesPath);
var moduleList = [];
var modulesNames = [];

fileList.map((file, index) => {
	if(file.indexOf(".js") > -1){
		modulesNames.push(file.substring(0,file.length-3));
	}
});

modulesNames.map((modulesName, index) => {
	moduleList.push(require(modulesPath+"/"+modulesName));
});

var middlewareList = [];
moduleList.map((moduleItem, index) => {
	middlewareList = middlewareList.concat(moduleItem);
});
module.exports = middlewareList;
// 加载模块 - 中间件 请勿改动此文件-----------------------------------