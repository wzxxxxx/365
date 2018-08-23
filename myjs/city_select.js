		mui.plusReady(function() {
			var self = plus.webview.currentWebview();
			var cityPicker3 = new mui.PopPicker({
				layer: 3
			});
			cityPicker3.setData(cityData3);
			cityPicker3.show(function(items) {
				var provinceCode = (items[0] || {}).value;
				var provinceName = (items[0] || {}).text;
				var cityCode = (items[1] || {}).value;
				var cityName = (items[1] || {}).text;
				var areaCode = (items[2] || {}).value;
				var areaName = (items[2] || {}).text;
				if(cityCode && cityName) {
					var shouye = plus.webview.getWebviewById('tab_shouye.html');
					var main = plus.webview.currentWebview().opener();
					var service = plus.webview.getWebviewById('tab_service.html');
					var param = {
						"provinceCode": provinceCode,
						"provinceName": provinceName,
						"cityCode": cityCode,
						"cityName": cityName,
						"areaCode": areaCode,
						"areaName": areaName
					};
					mui.fire(shouye, 'changeCity', param);
					mui.fire(main, 'changeCity', param);
					mui.fire(service, 'changeCity', param);
				}
				plus.webview.currentWebview().close();
				mui.back = function() {
					console.log(3)
					// 隐藏弹出层		
					var list = plus.webview.currentWebview().opener();
					list.close();
				}
			})
		});

		mui.back = function() {
			// 隐藏弹出层
			//plus.webview.currentWebview().close();
			var list = plus.webview.currentWebview().opener();
			//			list.setStyle({
			//				mask: "none"
			//			});
			list.close();
		}
		document.addEventListener("tap", function() {
			var list = plus.webview.currentWebview().opener();
			//			list.setStyle({
			//				mask: "none"
			//			});
			plus.webview.currentWebview().close();
		})
