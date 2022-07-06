var uniIdConfig;
var uniPayConfig;
try {
	uniIdConfig = require('../uni-id/config.json');
} catch(err) {
	console.error("配置文件：uniCloud/cloudfunctions/common/uni-config-center/uni-id/config.json 编译错误，请检查！↓↓↓请查看下方的错误提示↓↓↓", err.name, err.message, err);
	throw new Error("配置文件：uniCloud/cloudfunctions/common/uni-config-center/uni-id/config.json 编译错误，请检查！↑↑↑请查看上方的错误提示↑↑↑");
}

module.exports = {
	"uni": uniIdConfig,
	"uni-pay": uniPayConfig,
	"vk": {
		"system": {
			// 若serviceShutdow:true，则所有云函数无法访问（适用于需要临时关闭后端服务的情况，如迁移数据）
			// 注意：本地调试时，需要重新启动本地服务才能生效。
			"serviceShutdown": false,
			"serviceShutdownDescription": "系统维护中，预计2小时恢复!",
			// 云函数默认时区（中国为8）
			"targetTimezone": 8
		},
		// 当 context 内的下面值为空时，赋予默认的值（主要用于解决云函数 URL 后的默认 APPID 问题。
		"context": {
			"APPID": "", // 默认 dcloud_appid
			"PLATFORM": "h5", // 可选项 h5、mp-weixin、app-plus、mp-alipay
			"LOCALE": "zh-Hans", // 默认语言
		},
		"service": {
			// 邮箱发送服务
			"email": {
				// qq邮箱参数配置
				"qq": {
					"host": "smtp.qq.com",
					"port": 465,
					"secure": true,
					"auth": {
						"user": "你的邮箱@qq.com",
						"pass": "邮箱授权码"
					}
				}
			},
			// 日志服务
			"log": {
				// 用户登录日志
				"login": {
					"status": true // 是否开启用户登录日志
				}
			},
			// 短信服务
			"sms": {
				// 阿里云短信服务
				"aliyun": {
					"enable": false,                // 是否使用阿里云短信代替unicloud短信发送短信验证码
					"accessKeyId": "",              // 短信密钥key
					"accessKeySecret": "",          // 短信密钥secret
					"signName": "",                 // 默认签名
					"templateCode": {
						"verifyCode": ""              // 验证码短信模板 - 配合uni-id需要
					}
				}
			},
			// 开放平台api
			"openapi": {
				// 百度开放平台 (主要用于身份证识别,营业执照识别等API)
				// API Key申请地址：https://cloud.baidu.com/doc/OCR/s/rk3h7xzck 点击右上角注册
				"baidu": {
					"appid": "",    // 对应的API Key
					"appsecret": "" // 对应的Secret Key
				}
			}
		},
		"db": {
			"unicloud": {
				"maxLimit": 500, // 最大limit限制(目前腾讯云最大1000,阿里云最大500)
				"cancelAddTime": false, // 取消vk.baseDao.add 时自动生成_add_time和_add_time_str
				"getTableData": {
					"sortArr": [{ "name": "_add_time", "type": "desc" }], // vk.baseDao.getTableData 默认排序规则 vk.db.unicloud.getTableData.sortArr
				}
			}
		},
		// 其他小程序的密钥 当需要多个小程序绑定同一服务空间,并调用小程序服务端API时需要填写 暂只支持微信小程序
		"oauth": {
			// 微信小程序
			"weixin": {
				// 密钥列表
				"list": [
					{ "appid": "", "appsecret": "" },
					{ "appid": "", "appsecret": "" }
				]
			}
		}
	}
};
