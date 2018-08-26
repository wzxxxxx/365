			var mbi_number;
			mui.plusReady(function() {
				var loginData = {};
				var id = setInterval(function() {
					if(localStorage.getItem('login')) {
						clearInterval(id);
						loginData = JSON.parse(localStorage.getItem('login'));
						mbi_number = loginData.data.info.mbi_id;

						getOrder();
					}
				}, 20);
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

