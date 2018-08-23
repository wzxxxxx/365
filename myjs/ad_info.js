			mui.plusReady(function(){
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData){
					return;
				}
				var self = plus.webview.currentWebview();
				var ar_id = self.ar_id || '';
				var adParam = {
					service: 'Hlbr365app.Ad.GetInfo',
					ar_id: ar_id,
					mbi_id: loginData.data.info.mbi_id,
					ah_ip: '192.168.0.1'
				};
				wAjax(adParam, function(result){
					var info = result.data.info;
//					document.getElementById('adTitle').innerHTML =info.ar_title;
//					document.getElementById('adContent').innerHTML = info.ar_content;
//					document.getElementById('adImg').src = info.ar_img;
					document.getElementById('content').src = info.ar_content;
				})
				
			})
