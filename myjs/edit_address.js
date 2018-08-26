			var country_id = '';
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				var id = self.addr_id || '';
				getAddressInfo(id);
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
				document.getElementById('addAddress').addEventListener('tap', function() {
					// 登陆出现错误无法获取mbi_id
					addAddress(id, mbi_id);
//					addAddress(58);
				})
				getConutryList();
			})
			
			function getAddressInfo(id){
				var getAddrParam = {
					service: 'Hlbr365app.MemberDeliveryAddress.GetInfo',
					mda_id: id
				}
				wAjax(getAddrParam, function(result){
					var addrInfo = result.data.info;
					if(addrInfo){
						document.getElementById('name').value = addrInfo.mda_contacts_name;
						document.getElementById('number').value = addrInfo.mda_contacts_phone;
						document.getElementById('country').innerHTML = addrInfo.mda_contacts_county_name;
						document.getElementById('addressDetail').value = addrInfo.mda_contacts_address;
						document.getElementById('isDefault').value = addrInfo.mda_default;
					}
				})
			}

			function getConutryList() {
				var getCountryParam = {
					service: 'App.PublicClass.Country',
					id: 150700
				}
				wAjax(getCountryParam, function(result) {
					var countryList = result.data.list;
					var str = template('temp', {
						'record': countryList
					});
					document.getElementById("mui-template").innerHTML = str;
				})
			}

			function addAddress(mda_id, mbi_id) {
				var name = document.getElementById('name').value;
				var phoneNumber = document.getElementById('number').value;
				var addressDetail = document.getElementById('addressDetail').value;
				var isDefault = document.getElementById('isDefault').value;
				var addressParam = {
					service: 'Hlbr365app.MemberDeliveryAddress.Edit',
					mbi_id: mbi_id,
					mda_id: mda_id,
					mda_contacts_name: name,
					mda_contacts_phone: phoneNumber,
					mda_contacts_province: 150000,
					mda_contacts_city: 150700,
					mda_contacts_county: country_id,
					mda_contacts_address: addressDetail,
					mda_default: isDefault
				}
				wAjax(addressParam, function(result){
					var myAddress = plus.webview.getWebviewById('my_address.html');
					myAddress.reload();
					mui.back();
				})
			}

			mui("#mui-template").on('tap', 'a', function(e) {
				var id = this.getAttribute("id");
				country_id = id;
				document.getElementById('country').innerHTML = this.innerHTML;
				mui('#popover').popover('hide');

			});
