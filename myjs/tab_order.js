			//			mui.init({
			//				pullRefresh: {
			//					container: "#pullrefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			//					down: {
			//						style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			//						auto: false, //可选,默认false.首次加载自动上拉刷新一次
			//						callback: getOrder//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			//					}
			//				}
			//			});

			var mbi_number;
			mui.plusReady(function() {
				var loginData = {};
				var id = setInterval(function() {
					if(localStorage.getItem('login')) {
						clearInterval(id);
						//								$.fire(mainPage, 'show', null);
						//								mainPage.show("pop-in");
						loginData = JSON.parse(localStorage.getItem('login'));
						mbi_number = loginData.data.info.mbi_id;

						getOrder();
					}
				}, 20);

				//				var loginData = JSON.parse(localStorage.getItem('login'));
				//				if(!loginData) {
				//					return;
				//				}

			});

			function initSubpages(data) {
				var self = plus.webview.currentWebview();
				var group = new webviewGroup(self.id, {
					items: [{
						id: "tab_order_sub1.html",
						url: "tab_order_sub1.html",
						extras: {
							list: data
						}
					}, {
						id: "tab_order_sub2.html",
						url: "tab_order_sub2.html",
						extras: {
							list: data
						}
					}, {
						id: "tab_order_sub3.html",
						url: "tab_order_sub3.html",
						extras: {
							list: data
						}
					}, {
						id: "tab_order_sub4.html",
						url: "tab_order_sub4.html",
						extras: {
							list: data
						}
					}],
					onChange: function(obj) {
						var c = document.querySelector(".mui-control-item.mui-active");
						if(c) {
							c.classList.remove("mui-active");
						}
						var target = document.querySelector(".mui-scroll .mui-control-item:nth-child(" + (parseInt(obj.index) + 1) + ")");
						target.classList.add("mui-active");
						if(target.scrollIntoView) {
							target.scrollIntoView();
						}
					}
				});

				mui(".mui-scroll").on("tap", ".mui-control-item", function(e) {
					var wid = this.getAttribute("data-wid");
					group.switchTab(wid);
				});

			}

			function getOrder() {
				var orderParam = {
					service: 'Hlbr365app.Member.GetMyOrderList',
					mbi_number: mbi_number,
					firstRow: 1,
					listRows: 10
				};
				wAjax(orderParam, function(result) {
					var list = result.data.list;
					initSubpages(list);
				});
			}

