			(function($, doc) {
				$.init({
					statusBarBackground: '#f7f7f7'
				});
				$.plusReady(function() {
					plus.screen.lockOrientation("portrait-primary");
					plus.webview.currentWebview().setStyle({
						'popGesture': 'none'
					});
					//					var state = app.getState();
					var mainPage = plus.webview.getWebviewById("main");
					var main_loaded_flag = false;
					if(!mainPage) {
						mainPage = $.preload({
							"id": 'main',
							"url": 'main.html'
						});
					} else {
						main_loaded_flag = true;
					}

					mainPage.addEventListener("loaded", function() {
						main_loaded_flag = true;
					});
					var toMain = function() {
						//使用定时器的原因：
						//可能执行太快，main页面loaded事件尚未触发就执行自定义事件，此时必然会失败
						var id = setInterval(function() {
							if(main_loaded_flag) {
								clearInterval(id);
								$.fire(mainPage, 'show', null);
								mainPage.show("pop-in");
							}
						}, 20);
					};

					var token = localStorage.getItem('token');
					if(!token) {
						var uuid = plus.device.uuid;

						var data = {
							g_mark: uuid,
							g_type: 1,
							service: "App.Site.CreatToken"
						};
						//获取token
						mui.ajax({
							url: makeurl(data, true),
							data: {},
							type: 'get', //HTTP请求类型
							timeout: 10000, //超时时间设置为10秒；
							success: function(data) {
								//在这里将后台传过来判断是否可以自动登陆的字符串存到缓存中
								if(isRequestSuccess(data)) {
									localStorage.setItem('token', JSON.stringify(data));
								}

							},
							error: function(xhr, type, errorThrown) {
								//异常处理；
								console.log(type);
							}
						});
					}
					if(localStorage.getItem('login')) {
						toMain();
					}

					var login = function(loginInfo) {
						loginInfo = loginInfo || {};
						loginInfo.account = loginInfo.account || '';
						loginInfo.password = loginInfo.password || '';
						if(loginInfo.account.length < 11) {
							plus.nativeUI.toast('手机号最短为 11 个字符');
							return;
						}
						if(loginInfo.password.length < 6) {
							plus.nativeUI.toast('密码最短为 6 个字符');
							return;
						}
						// var ip = '192.168.0.100';
						// console.log(returnCitySN);
						var ip = returnCitySN["cip"];
						console.log(ip);
						var data = {
							service: "Hlbr365app.Member.Landed",
							mbi_login_phone: loginInfo.account,
							mbi_login_pwd: loginInfo.password,
							mln_type: 3,
							mln_ip: ip
						};

						wAjax(data, function(result) {
							localStorage.setItem('login', JSON.stringify(result));
							toMain();
						})
					};
					//检查 "登录状态/锁屏状态" 结束
					var loginButton = doc.getElementById('login');
					var accountBox = doc.getElementById('account');
					var passwordBox = doc.getElementById('password');
					var regButton = doc.getElementById('reg');
					var forgetButton = doc.getElementById('forgetPassword');
					loginButton.addEventListener('tap', function(event) {
						var loginInfo = {
							account: accountBox.value,
							password: passwordBox.value
						};
						login(loginInfo);
					});
					$.enterfocus('#login-form input', function() {
						$.trigger(loginButton, 'tap');
					});
					regButton.addEventListener('tap', function(event) {
						$.openWindow({
							url: 'reg.html',
							id: 'reg',
							preload: true,
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								popGesture: 'hide'
							},
							waiting: {
								autoShow: false
							}
						});
					}, false);
					forgetButton.addEventListener('tap', function(event) {
						$.openWindow({
							url: 'forget_password.html',
							id: 'forget_password',
							preload: true,
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								popGesture: 'hide'
							},
							waiting: {
								autoShow: false
							}
						});
					}, false);
				});
			}(mui, document));
