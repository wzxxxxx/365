			var country_id = '';
			mui.plusReady(function() {
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
				document.getElementById('addAddress').addEventListener('tap', function() {
					// 登陆出现错误无法获取mbi_id
					addAddress(mbi_id);
//					addAddress(58);
				})
				getConutryList();
			})

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

			function addAddress(mbi_id) {
				var name = document.getElementById('name').value;
				var phoneNumber = document.getElementById('number').value;
				var addressDetail = document.getElementById('addressDetail').value;
				var isDefault = document.getElementById('isDefault').checked ? 1 : 0;
				var addressParam = {
					service: 'Hlbr365app.MemberDeliveryAddress.Add',
					mbi_id: mbi_id,
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
					plus.nativeUI.toast("添加地址成功！");
					mui.back();
				})
			}

			mui("#mui-template").on('tap', 'a', function(e) {
				var id = this.getAttribute("id");
				country_id = id;
				document.getElementById('country').innerHTML = this.innerHTML;
				mui('#popover').popover('hide');

			});
