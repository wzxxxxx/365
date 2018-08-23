			var mbi_id = 58;
			mui.plusReady(function() {
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				mbi_id = loginData.data.info.mbi_id;
				getAddressList(mbi_id);

				var self = plus.webview.currentWebview();
				if(self.isChoosing) {
					mui("#mui-template").on('tap', '.mui-row', function(e) {
						var id = this.getAttribute("id");
						var order = plus.webview.getWebviewById('order_confirm.html');
						var param = {
							addr_id: id
						};
						mui.fire(order, "addr", param);
						//					order.reload();		
						setTimeout(function() {
							mui.back();
						}, 500)

					});
				}

				var addAddress = document.getElementById('addAddress');
				addAddress.addEventListener('tap', function() {
					mui.openWindow({
						url: "add_address.html",
						id: "add_address.html"
					})
				})
			})

			function getAddressList() {
				var getAddrParam = {
					service: 'Hlbr365app.MemberDeliveryAddress.GetList',
					mbi_id: mbi_id
				}
				wAjax(getAddrParam, function(result) {
					var addrList = result.data.info;
					var str = template('temp', {
						'record': addrList
					});
					document.getElementById("mui-template").innerHTML = str;
				})
			}

			function deleteAddress(mda_id) {
				var deleteParam = {
					service: 'Hlbr365app.MemberDeliveryAddress.Delete',
					mda_id: mda_id,
					mbi_id: mbi_id
				}
				wAjax(deleteParam, function() {
					location.reload();
				})
			}

			mui("#mui-template").on('tap', '.delete', function(e) {
				var id = this.getAttribute("id");
				mui.confirm('确认删除?', '家政365', ['是', '否'], function(event){
					if(event.index == 0){
						deleteAddress(id);
					}
				});
			});

			mui("#mui-template").on('tap', '.edit', function(e) {
				var name = this.getAttribute("name");
				mui.openWindow({
					url: "edit_address.html",
					id: "edit_address.html",
					extras: {
						addr_id: name
					}
				})

			});
