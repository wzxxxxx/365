			mui.plusReady(function() {
				var address = document.getElementById('address');
				address.addEventListener('tap', function() {
					mui.openWindow({
						url: "my_address.html",
						id: "my_address.html"
					})
				})

				var changePwd = document.getElementById('changePwd');
				changePwd.addEventListener('tap', function() {
					mui.openWindow({
						url: "change_password.html",
						id: "change_password.html"
					})
				})
				
				document.getElementById('aboutus').addEventListener('tap', function(){
					mui.openWindow({
						url: "about_us.html",
						id: "about_us.html"
					})
				})

				initCacheSize();
				
				var clearCache = document.getElementById('clearCache');
				clearCache.addEventListener('tap', function(){
					var loginData = localStorage.getItem('login');
					var tokenData = localStorage.getItem('token');
					plus.cache.clear(function(){
						plus.nativeUI.toast("缓存已清除");
						initCacheSize();
						localStorage.setItem('login', loginData);
						localStorage.setItem('token', tokenData);
					})
				})

			})
			
			function initCacheSize(){
				plus.cache.calculate(function(size) {
					document.getElementById('clearCache').innerHTML = '清除缓存 (' + formatSize(size) + ')';
				})
			}

			function formatSize(size) {
				var fileSizeString;
				size = parseInt(size);
				if(size == 0) {
					fileSizeString = "0B";
				} else if(size < 1024) {
					fileSizeString = size + "B";
				} else if(size < 1048576) {
					fileSizeString = (size / 1024).toFixed(2) + "KB";
				} else if(size < 1073741824) {
					console.log("Mb" + size);
					fileSizeString = (size / 1048576).toFixed(2) + "MB";
					console.log("/ after" + fileSizeString);
				} else {
					fileSizeString = (size / 1073741824).toFixed(2) + "GB";
				}
				return fileSizeString;
			}
