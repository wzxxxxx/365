			mui.plusReady(function(){
				var sendButton = document.getElementById('send');
					var mobileBox = document.getElementById('mobile');
					var passwordBox = document.getElementById('password');
					var passwordconfirmBox = document.getElementById('passwordconfirm');
					
					var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
					
					sendButton.addEventListener('tap', function() {
						if (passwordconfirmBox.value != passwordBox.value) {
							plus.nativeUI.toast('密码两次输入不一致');
							return;
						}
						var changeParam = {
							service: 'Hlbr365app.Member.EditPassword',
							mbi_id: mbi_id,
							raw_pwd: mobileBox.value,
							new_pwd: passwordBox.value,
							req_pwd: passwordconfirmBox.value
						}
						wAjax(changeParam, function(result){
							mui.back();
						})
//						app.forgetPassword(mobileBox.value, function(err, info) {
//							plus.nativeUI.toast(err || info);
//						});
					}, false);
			})
