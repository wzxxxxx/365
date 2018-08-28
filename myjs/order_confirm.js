				var addrId = '';
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					if(self.good_id) {
						getGoodInfo(self.good_id);
					}
					var loginData = JSON.parse(localStorage.getItem('login'));
					if(!loginData) {
						return;
					}
					var mbi_id = loginData.data.info.mbi_id;
					getDefaultAddr(mbi_id);
					document.getElementById('chooseAddress').addEventListener('tap', function() {
						mui.openWindow({
							url: 'my_address.html',
							id: 'my_address.html',
							extras: {
								isChoosing: true
							}
						})
					})

					document.getElementById('chooseTime').addEventListener('tap', function() {
						var endDate = new Date(new Date().setDate(new Date().getDate() + 6));
						var dtPicker = new mui.DtPicker({
							beginDate: new Date(),
							endDate: endDate,
							customData: {
								"i": [{
										"text": "00",
										"value": "00"
									},
									{
										"text": "30",
										"value": "30"
									}
								]

							}
						});
						dtPicker.show(function(selectItems) {
							document.getElementById('time').innerHTML = selectItems.text;
						})
					})

					document.getElementById('submit').addEventListener('tap', function() {
						submitOrder(self.good_id, mbi_id);
					})

				})

				window.addEventListener('addr', function(event) {
					if(event) {
						addrId = event.detail.addr_id;
						getAddressInfo(addrId);
					}
				});

				function getAddressInfo(id) {
					var getAddrParam = {
						service: 'Hlbr365app.MemberDeliveryAddress.GetInfo',
						mda_id: id
					}
					wAjax(getAddrParam, function(result) {
						var addrInfo = result.data.info;
						if(addrInfo) {
							document.getElementById('noAddr').setAttribute('class', 'mui-hidden');
							document.getElementById('gotAddr').setAttribute('class', 'mui-row');
							document.getElementById('name').innerHTML = '联系人：' + addrInfo.mda_contacts_name;
							document.getElementById('phoneNumber').innerHTML = '联系电话：' + addrInfo.mda_contacts_phone;
							document.getElementById('address').innerHTML = '联系地址：' + addrInfo.mda_contacts_province_name +
								addrInfo.mda_contacts_city_name + addrInfo.mda_contacts_county_name + addrInfo.mda_contacts_address;
						}
					})
				}
				
				function getDefaultAddr(mbi_id){
					var defaultAddrparam = {
						service: 'Hlbr365app.MemberDeliveryAddress.GetDefault',
						mbi_id: mbi_id
					}
					wAjax(defaultAddrparam, function(result){
						var addrInfo = result.data.info;
						if(addrInfo) {
							addrId = addrInfo.mda_id;
							document.getElementById('noAddr').setAttribute('class', 'mui-hidden');
							document.getElementById('gotAddr').setAttribute('class', 'mui-row');
							document.getElementById('name').innerHTML = '联系人：' + addrInfo.mda_contacts_name;
							document.getElementById('phoneNumber').innerHTML = '联系电话：' + addrInfo.mda_contacts_phone;
							document.getElementById('address').innerHTML = '联系地址：' + addrInfo.mda_contacts_province_name +
								addrInfo.mda_contacts_city_name + addrInfo.mda_contacts_county_name + addrInfo.mda_contacts_address;
						}
					})
				}

				function getGoodInfo(good_id) {
					var getGoodParam = {
						service: 'Hlbr365app.Goods.GetGoodsInfo',
						jg_id: good_id
					}
					wAjax(getGoodParam, function(result) {
						var info = result.data.info;
						document.getElementById('goodName').innerHTML = info.jg_name;
						document.getElementById('goodIntro').innerHTML = info.jg_intro;
					})
				}

				function submitOrder(good_id, mbi_id) {
					if(!addrId){
						plus.nativeUI.toast('请选择地址！');
						return;
					}
					var timeText = document.getElementById('time').innerHTML;
					if(!timeText){
						plus.nativeUI.toast('请选择服务时间！');
						return;
					}
					var orderDate = new Date(timeText.replace(/-/g, "/"));
					var submitParam = {
						service: 'Hlbr365app.Order.AddOrder',
						user_number: mbi_id,
						jg_id: good_id,
						mda_id: addrId,
						predict_time: Number(orderDate) / 1000
					}
					var remark = document.getElementById('remark').value;
					if(remark) {
						submitParam.ob_remark = remark;
					}
					plus.nativeUI.showWaiting();
					wAjax(submitParam, function(result){
						plus.webview.getWebviewById('tab_order.html').reload();
						plus.nativeUI.closeWaiting();
						plus.nativeUI.toast('订单提交成功！');
						mui.back();
					})
				}
