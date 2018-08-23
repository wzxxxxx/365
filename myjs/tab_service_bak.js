			//默认为海拉尔市
			var city_id = '150700';

			window.addEventListener('changeCity', function(event) {
				if(event) {
					city_id = event.detail.cityCode; //市id
					//					var cityName = event.detail.cityName; //市名称
					//					var areaCode = event.detail.areaCode; //区id
					//					var areaName = event.detail.areaName; //区名称
					var cityName = event.detail.cityName; //市名称
					document.getElementById("city_name").innerText = cityName;
				}
			});

			mui.plusReady(function() {
				var citySelected = document.getElementById('city_name');
				var serviceSelected = document.getElementById('service_name');
				citySelected.addEventListener('tap', function(event) {
					if(window.plus) {
						mui.openWindow({
							url: 'city_select.html',
							id: 'city_select.html',
							waiting: {
								autoShow: false //自动显示等待框，默认为true
							},
							styles: {
								bottom: '0px',
								background: 'transparent',
								opacity: 1,
								zindex: "100"
							}
						});
					} else {
						mui.toast("请在html5+引擎环境使用");
					}
				});

				var typeListParam = {
					service: 'Hlbr365app.Article.GetTypeList'
				};

				wAjax(typeListParam, function(result) {
					var typeList = result.data.list;
					//					var str4 = template('temp4', {
					//						'record': typeList
					//					});
					//					document.getElementById("mui-template4").innerHTML = str4;
				});

				//				getGoodsList();
			})

			function getGoodsList(typeID) {
				var goodsListWithInfo = [];
				var goodsParam = {
					service: 'Hlbr365app.Goods.GetServiceList',
					two_type_id: typeID,
					city_id: city_id,
					firstRow: 1,
					listRows: 20
				}			
				wAjax(goodsParam, function(result) {
					var goodsList = result.data.list;
					for(var i = 0; i < goodsList.length; i++) {
						var goodsWithInfo = getGoodsInfo(goodsList[i].jg_id) || {};
						goodsListWithInfo.push(goodsWithInfo);
					}

					var str = template('temp', {
						'record': goodsListWithInfo
					});
					document.getElementById("mui-template").innerHTML = str;

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
