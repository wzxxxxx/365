/**
 * 
 * 
 * 
 **/

(function($, owner) {

	document.write("<script language=javascript src='js/md5.js'></script>");

	var serverUrl = "http://365gateway.lanyukj.cn/public/index.php";
	var ipUrl = 'http://members.3322.org/dyndns/getip';

	//url拼接(包含sign)
	makeurl = function(data, isGetToken) {
		if(!isGetToken) {
			data.gateway = "App.Site.gatewayapp";
			if(localStorage.getItem('token')) {
				data.g_token = JSON.parse(localStorage.getItem('token')).data.info.g_token;
				data.g_mark = JSON.parse(localStorage.getItem('token')).data.info.g_mark;
			}
		}
		var str = '',
			arr = [],
			str2 = '';
		Object.keys(data).forEach(function(key) {
			str += ("&" + key + "=" + data[key]);
			arr.push(key);
		});
		arr.sort();
		for(var i in arr) {
			str2 += data[arr[i]];
		}
		str += "&sign=" + hex_md5(str2);
		return serverUrl + str.replace(/&/, "?");
	}

	//判断是否请求成功
	isRequestSuccess = function(data) {
		var ret = data.ret,
			code = (data.data || {}).code;
		if(ret && ret == 200 && code && code == 1) {
			return true;
		} else {
			plus.nativeUI.toast(data.data.msg);
			return false;
		}
	}

	wAjax = function(data, success) {
		$.ajax(makeurl(data), {
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(isRequestSuccess(data)) {
					return success(data);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				return;
			}
		});
	}

	//获取公网IP地址
	getIp = function() {
		mui.ajax(ipUrl, {
			dataType: 'json',
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				if(data) {
					console.log(data);
					return data;
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				return;
			}
		});
	}

	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.account.length < 11) {
			return callback('手机号最短为 11 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		console.log(localStorage.getItem('token'));
		//		var ip = getIp();
		//		if(!ip) {
		//			plus.nativeUI.toast('未能获取手机IP地址');
		//			return;
		//		}
		var ip = '192.168.0.100';
		var data = {
			service: "Hlbr365app.Member.Landed",
			mbi_login_phone: loginInfo.account,
			mbi_login_pwd: loginInfo.password,
			mln_type: 3,
			mln_ip: ip
		};

		mui.ajax(makeurl(data), {
			dataType: 'json',
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				if(isRequestSuccess(data)) {
					owner.createState(loginInfo.account, callback);
					localStorage.setItem('login', JSON.stringify(data));
				}
				return callback();
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				return callback();
			}
		});

	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};

		mui.ajax(makeurl(regInfo), {
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				return callback(data.data.msg);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				return callback('网络连接错误');
			}
		});
		return callback();
	};

	/**
	 * 获取验证码
	 **/
	owner.getYanzhengma = function(data, callback) {
		callback = callback || $.noop;
		data = data || {};
		console.log(makeurl(data));
		mui.ajax(makeurl(data), {
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				return callback(data.data.msg);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				return callback('网络连接错误');
			}
		});

	}

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));