			mui.plusReady(function() {
				var settingsBox = document.getElementById('settings');
				var reloginBox = document.getElementById('relogin');
				var collectionBox = document.getElementById('collection');
				var noticeBox = document.getElementById('notice');
				var youhuiquanBox = document.getElementById('youhuiquan');
				youhuiquanBox.addEventListener('tap', function(){
					mui.openWindow({
						url: 'my_coupon.html',
						id: 'my_coupon.html'

					});
				})
				settingsBox.addEventListener('tap', function(event) {
					mui.openWindow({
						url: 'settings.html',
						id: 'settings.html'

					});
				});
				reloginBox.addEventListener('tap', function() {
					localStorage.removeItem('login');
					mui.openWindow({
						url: 'login.html',
						id: 'login.html'
					})
//					plus.webview.show('login.html', 'pop-in');
				});
				collectionBox.addEventListener('tap', function() {
					mui.openWindow({
						url: 'collections.html',
						id: 'collections.html'
					})
				});
				noticeBox.addEventListener('tap', function() {
					mui.openWindow({
						url: 'edit_profile.html',
						id: 'edit_profile.html'
					})
				})

				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
				getProfile(mbi_id);
			})

			function getProfile(id) {
				var profileParam = {
					service: 'Hlbr365app.Member.GetInfo',
					mbi_id: id
				}
				wAjax(profileParam, function(result) {
					var info = result.data.info;
					document.getElementById('name').innerHTML = info.mei_real_name || '未命名';
					if(info.mei_head) {
						document.getElementById('avatar').src = info.mei_head;
					}
				})
			}
