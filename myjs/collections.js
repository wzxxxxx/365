			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
						auto: false, //可选,默认false.首次加载自动上拉刷新一次
						callback: pulldownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					},
					up: {
						auto: false,
						contentrefresh: '正在加载...',
						callback: pullupRefresh
					}
				}
			});

			mui.plusReady(function() {
				getCollections(true);

				mui("#mui-template").on('tap', 'a', function(e) {
					var id = this.getAttribute("id");
					mui.openWindow({
						url: 'goods_info.html',
						id: 'goods_info.html',
						extras: {
							good_id: id
						} //自定义扩展参数
					});

				});

			})

			var pageIndex = 2;

			function getCollections(isDown) {
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}

				var mbi_id = loginData.data.info.mbi_id;
				var collectionParam = {
					service: 'Hlbr365app.Member.GetMyCollectList',
					mbi_id: loginData.data.info.mbi_id,
					jc_type: 1,
					firstRow: isDown ? 1 : pageIndex,
					listRows: 10
				}
				wAjax(collectionParam, function(result) {
					var collectionList = result.data.list;
						var str = template('temp', {
							'record': collectionList
						});
						//如果为下拉刷新 将分页数置为2;如果为上拉刷新且数据不为空, 分页数+1
						isDown ? pageIndex = 2 : (str.trim() && pageIndex++);
						document.getElementById('no_content').hidden = pageIndex - 1 || str.trim();
//						!isDown && document.getElementById('no_content').hidden ? mui('#pullrefresh').pullRefresh().enablePullupToRefresh() : mui(
//							'#pullrefresh').pullRefresh().disablePullupToRefresh();
						isDown ? document.getElementById("mui-template").innerHTML = str : document.getElementById("mui-template").insertAdjacentHTML('beforeend', str);
						!isDown && collectionList.length < 10 ? mui('#pullrefresh').pullRefresh().endPullupToRefresh(true) : mui('#pullrefresh').pullRefresh().endPullupToRefresh();
					})

				}

			function pulldownRefresh() {
				mui('#pullrefresh').pullRefresh().refresh(true);
				setTimeout(function(){
					getCollections(true);
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					mui.toast('刷新成功!');
				}, 1000)
				
			}

			function pullupRefresh() {
				setTimeout(function() {
					getCollections(false);
				}, 1000);
			}