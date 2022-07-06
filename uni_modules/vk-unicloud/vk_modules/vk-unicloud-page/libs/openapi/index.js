/**
 * 开放API
 */
import baidu from './baidu'

var openapi = {};
openapi.baidu = baidu;
openapi.init = function(util){
	openapi.baidu.init(util);
}
// 微信小程序API
export default openapi;


