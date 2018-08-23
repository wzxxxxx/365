			var country_id = '150702';
			var type_id = 1;
			var name = '';
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				self.show('slide-in-right', 200);
				plus.nativeUI.closeWaiting();
				getConutryList();
				if(self.type_id && self.first_id && self.name) {
					document.getElementById('openPopove2r').innerHTML = self.name + '<img src="images/img18.png" class="list-down-img"/><span class="fengeline">|</span>';
					type_id = self.type_id;
					getGoodsList();
					getSecondTypeList(self.first_id);
				}
				if(self.input) {
					console.log(self.input);
					name = self.input;
					document.getElementById('firstrow').hidden = "true";
					getGoodsList();
				}

				var shopOrgood = document.getElementById('shopOrgood');
				shopOrgood.addEventListener('tap', function() {
					if(shopOrgood.innerHTML == '店铺') {
						getShopList();
						shopOrgood.innerHTML = '服务';
					} else if(shopOrgood.innerHTML == '服务') {
						getGoodsList();
						shopOrgood.innerHTML = '店铺';
					}
				})

			})

			mui("#mui-template").on('tap', 'a', function(e) {
				showWaiting();
				var id = this.getAttribute("id");
				var name = this.getAttribute('name');
				if(name == 'isGood') {
					mui.openWindow({
						url: 'ad_info.html',
						id: 'ad_info.html',
						extras: {
							ar_id: id
						} //自定义扩展参数
					});
				} else {
					mui.openWindow({
						url: 'goods_info.html',
						id: 'goods_info.html',
						extras: {
							good_id: id
						}, //自定义扩展参数
						show: {
							autoShow: false, //页面loaded事件发生后自动显示，默认为true
							event: 'loaded' //页面显示时机，默认为titleUpdate事件时显示
						}
					});
				}
			});

			mui("#mui-template2").on('tap', 'a', function(e) {
				showWaiting();
				var id = this.getAttribute("id");
				type_id = id;
				getGoodsList();
				document.getElementById('openPopove2r').innerHTML = this.innerHTML + '<img src="images/img18.png" class="list-down-img"/><span class="fengeline">|</span>';
				mui('#popover2').popover('hide');

			});

			mui("#mui-template11").on('tap', 'a', function(e) {
				showWaiting();
				var id = this.getAttribute("id");
				//				for(var i = 0; i < typeList.length; i++) {
				//					if(typeList[i].si_id == id) {
				//						document.getElementById('firstTypeIcon').src = typeList[i].si_icon;
				//						document.getElementById('firstTypeName').innerHTML = typeList[i].si_name;
				//					}
				//				}
				country_id = id;
				getGoodsList();
				document.getElementById('openPopover').innerHTML = this.innerHTML + '<img src="images/img18.png" class="list-down-img"/><span class="fengeline">|</span>';
				mui('#popover').popover('hide');

			});

			function getGoodsList() {
				var goodsParam = {
					service: 'Hlbr365app.Goods.GetServiceList',
					firstRow: 1,
					listRows: 20
				}
				if(name != '') {

					goodsParam.name = name;
				} else {
					goodsParam.two_type_id = type_id;
					goodsParam.city_id = country_id;
				}
				wAjax(goodsParam, function(result) {
					var goodsList = result.data.list;
					document.getElementById('no_content').hidden = goodsList.length > 0;
					var str = template('temp', {
						'record': goodsList
					});
					document.getElementById("mui-template").innerHTML = str;
					plus.nativeUI.closeWaiting();
				})
			}

			function getShopList() {
				var shopListParam = {
					service: 'Hlbr365app.Goods.GetCompanyList',
					two_type_id: type_id,
					city_id: country_id,
					firstRow: 1,
					listRows: 20
				}
				wAjax(shopListParam, function(result) {

					var shopList = result.data.list;
					document.getElementById('no_content').hidden = shopList.length > 0;
					//					if(shopList.length < 1) {
					//						document.getElementById('mui-template').innerHTML = '';
					//						document.getElementById('no_content').setAttribute('class', '');

					//					} else {
					//						document.getElementById('no_content').setAttribute('class', 'mui-hidden');
					var str = template('temp', {
						'record': shopList
					});
					document.getElementById("mui-template").innerHTML = str;
					//					}
					plus.nativeUI.closeWaiting();
				})
			}

			function getGoodsInfo(goodsId) {
				var infoParam = {
					service: 'Hlbr365app.Goods.GetGoodsInfo',
					jg_id: goodsId
				}
				wAjax(infoParam, function(result) {
					var goodsInfo = result.data.info;
					return goodsInfo;
				})

			}

			function getSecondTypeList(firtTypeId) {
				var secTypeListParam = {
					service: 'Hlbr365app.Goods.GetTwoListByOne',
					si_id: firtTypeId,
					city_id: '150702'
				}
				wAjax(secTypeListParam, function(result) {
					var sceTypeList = result.data.info.service;
					var str = template('temp2', {
						'record': sceTypeList
					});
					document.getElementById("mui-template2").innerHTML = str;

				})
			}

			function getConutryList() {
				var getCountryParam = {
					service: 'App.PublicClass.Country',
					id: 150700
				}
				wAjax(getCountryParam, function(result) {
					var countryList = result.data.list;
					var str = template('temp3', {
						'record': countryList
					});
					document.getElementById("mui-template11").innerHTML = str;
				})
			}
