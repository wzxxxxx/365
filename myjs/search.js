			mui.plusReady(function() {
				var history = (localStorage.getItem('history') || '').trim();
				if(history) {
					document.getElementById('historySearch').hidden = false;
					var hisArr = history.split(' ', 5);
					var str = template('temp0', {
						"record": hisArr
					});
					document.getElementById("mui-template0").innerHTML = str;
				} else {
					document.getElementById('historySearch').hidden = true;
				}

				var hotSearchParam = {
					service: 'Hlbr365app.Member.GetHotSearch'
				};
				wAjax(hotSearchParam, function(result) {
					var hotList = result.data.info;
					var str = template('temp', {
						"record": hotList
					});
					document.getElementById("mui-template").innerHTML = str;
				})

				//				document.getElementById('searchBtn').addEventListener('tap', function() {
				//					document.getElementById('searchInput').value = '';
				//					//					var input = document.getElementById('searchInput').value;
				//					//					if(!input){
				//					//						plus.nativeUI.toast("请输入内容!");
				//					//						return;
				//					//					searchGoods(input);
				//				})

				document.querySelector('form').addEventListener('submit', function(e) {
					e.preventDefault(); // 阻止默认事件
					document.activeElement.blur();
					//  var searchBtn = document.getElementById('searchBtn');
					//  mui.trigger(searchBtn);
					var input = document.getElementById('searchInput').value;
					if(!input) {
						plus.nativeUI.toast("请输入内容!");
						return;
					}
					var history = localStorage.getItem('history') || '';
					history = input + ' ' + history;
					localStorage.setItem('history', history);
					searchGoods(input);
				});

				document.getElementById('searchBtn').addEventListener('tap', function() {
					var input = document.getElementById('searchInput').value;
					if(!input) {
						plus.nativeUI.toast("请输入内容!");
						return;
					}
					var history = localStorage.getItem('history') || '';
					history = input + ' ' + history;
					localStorage.setItem('history', history);
					searchGoods(input);
				})

				document.getElementById('clearHistory').addEventListener('tap', function() {
					localStorage.removeItem('history');
					document.getElementById('mui-template0').innerHTML = '';
				})
			})

			function searchGoods(input) {
				console.log(input);
				mui.openWindow({
					url: 'service_list.html',
					id: 'service_list.html',
					extras: {
						input: input
					}
				});
			}

			mui("#mui-template").on('tap', 'button', function(e) {
				var name = this.innerHTML;
				searchGoods(name);
			});
