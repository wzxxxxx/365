				//默认为海拉尔市
				var city_id = '150702';

				mui.init({
					pullRefresh: {
						container: '#pullrefresh',
						down: {
							style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
							auto: false, //可选,默认false.首次加载自动上拉刷新一次
							callback: getConutryList //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
						}
					}
				});

				////				// 常用配置项
				//				var options = {
				//					scrollY: false,
				//					scrollX: true,
				//					startX: 0,
				//					startY: 0,
				//					indicators: false,
				//					deceleration: 0.0006,
				//					bounce: false
				//				}
				////
				//				mui('.inc-scroll-landscape-container').scroll({
				//					deceleration: 0.0006 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				//				});

				mui.plusReady(function() {
					getConutryList();
					mui('.mui-segmented-control-inverted').scroll();
					document.getElementById('toClass').addEventListener('tap', function() {
						var main = plus.webview.currentWebview().opener();
						mui.fire(main, 'toClass', null);
					})
				});

				function getConutryList() {
					var getCountryParam = {
						service: 'App.PublicClass.Country',
						id: 150700
					}
					wAjax(getCountryParam, function(result) {
						var countryList = result.data.list;
						var str = template('temp0', {
							'record': countryList
						});
						document.getElementById("mui-template0").innerHTML = str;
						getAdList();
					})
				}

				function getAdList() {
					if(city_id) {
						var adParam = {
							service: 'Hlbr365app.Ad.GetList',
							ap_id: 1,
							ar_city_id: city_id
						};
						wAjax(adParam, function(result) {
							var adList = result.data.list.top;
							var middleAd = result.data.list.middle;
							var middleAdImg = document.getElementById('middleAd');
							var adTitle = document.getElementById('adTitle');
							if(adList.length > 0) {
								adTitle.innerHTML = adList[0].ar_title;
							} else {
								adTitle.hidden = true;
								adList.push({
									ar_id: '',
									ar_img: 'images/normal_pic.png'
								})
							}
							if(middleAd) {
								middleAdImg.src = middleAd.ar_img;

								middleAdImg.addEventListener('tap', function() {
									mui.openWindow({
										url: 'ad_info.html',
										id: 'ad_info.html',
										extras: {
											ar_id: middleAd.ar_id
										}
									})
								});
							}

							var str = template('temp', {
								"record": adList
							});
							document.getElementById("mui-template").innerHTML = str;
							//加该行后slider才可以滑动, 不知道为啥..
							var slider = mui('.mui-slider').slider();
							var ele = document.createElement('div');
							ele.setAttribute('class', 'mui-indicator');
							for(var i = 1; i < adList.length; i++) {
								document.getElementById('indicators').appendChild(ele);
							}
							getServiceList();
						});

					}
				}

				function getServiceList() {
					var serviceParam = {
						service: 'Hlbr365app.Goods.GetRecommendList'
					};
					wAjax(serviceParam, function(result) {
						var firstServiceList = result.data.info.one;
						var secondServiceList = result.data.info.two;
						var str2 = template('temp2', {
							'record': firstServiceList
						});
						document.getElementById("mui-template2").innerHTML = str2;
						var str3 = template('temp3', {
							'record': secondServiceList
						});
						document.getElementById('mui-template3').innerHTML = str3;
						getTypeList();
					})
				}

				function getTypeList() {
					var typeListParam = {
						service: 'Hlbr365app.Article.GetTypeList'
					};
					wAjax(typeListParam, function(result) {
						var typeList = result.data.list;
						var str4 = template('temp4', {
							'record': typeList
						});
						document.getElementById("mui-template4").innerHTML = str4;
						getRecGoods();
					});
				}

				//				function createWebview() {
				//					var nw = null;
				//					nw = nw || plus.webview.create('http://m.weibo.cn/u/3196963860', 'test', {
				//						popGesture: 'hide',
				//						subNViews: [{
				//							id: 'subnview1',
				//							styles: {
				//								top: '0px',
				//								height: '100px',
				//								backgroundColor: '#FF0000'
				//							},
				//							tags: [{
				//								tag: 'font',
				//								id: 'font',
				//								text: '原生子View控件',
				//								textStyles: {
				//									size: '18px'
				//								}
				//							}]
				//						}]
				//					});
				//					nw.addEventListener('close', function() {
				//						nw = null;
				//					}, false);
				//					nw.show('pop-in');
				//				}

				function getRecGoods() {
					var recGoodsParam = {
						service: 'Hlbr365app.Goods.GetRecommendGoodsList',
						city_id: city_id,
						firstRow: 1,
						listRows: 20
					}
					wAjax(recGoodsParam, function(result) {
						var goodsList = result.data.list;
						// 实体字符转换
						//					var ele = document.createElement('div');
						//					for (var i =0 ; i < goodsList.length; i++) {
						//						ele.innerHTML = goodsList[i].jg_content;
						//						goodsList[i].jg_content = ele.innerText;
						//					}

						//					ele.innerHTML = info.jg_content;
						//					document.getElementById('info').innerHTML = ele.innerText;
						//					template.config('escape', false);
						var str5 = template('temp5', {
							'record': goodsList
						});
						document.getElementById('mui-template5').innerHTML = str5;
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					})
				}

				mui("#mui-template").on('tap', 'a', function(e) {
					var id = this.getAttribute("id");
					if(id) {
						mui.openWindow({
							url: 'ad_info.html',
							id: 'ad_info.html',
							extras: {
								ar_id: id
							}
						});
					}
				});

				mui("#mui-template2").on('tap', 'img', function(e) {
					var id = this.getAttribute("id");
					var param = {
						service_id: id
					};
					var main = plus.webview.currentWebview().opener();
					var service = plus.webview.getWebviewById('tab_service.html');
					mui.fire(service, 'toService', param);
					setTimeout(function() {
						mui.fire(main, 'toSerive', param);
					}, 100)
				});

				mui("#mui-template3").on('tap', 'img', function(e) {
					var id = this.getAttribute("id");
					var sid = this.getAttribute("name");
					var name = this.getAttribute("sname")
					mui.openWindow({
						url: 'service_list.html',
						id: 'service_list.html',
						extras: {
							first_id: sid,
							type_id: id,
							name: name
						} //自定义扩展参数
					});
				});

				mui("#mui-template0").on('tap', 'a', function(e) {
					var id = this.getAttribute("id");
					city_id = id;
					var cityName = this.innerHTML;
					var main = plus.webview.currentWebview().opener();
					var service = plus.webview.getWebviewById('tab_service.html');
					var param = {
						cityCode: id,
						cityName: cityName
					}
					mui.fire(main, 'changeCity', param);
					mui.fire(service, 'changeCity', param);
					mui('#popover').popover('hide');

				});

				mui("#mui-template4").on('tap', 'li', function(e) {
					var id = this.getAttribute("id");
					var param = {
						typeId: id
					}
					var main = plus.webview.currentWebview().opener();
					var classPage = plus.webview.getWebviewById('tab_class.html');
					mui.fire(main, 'toClass', param);
					mui.fire(classPage, 'toClass', param);
					//					mui.openWindow({
					//						url: 'goods_info.html',
					//						id: 'goods_info.html',
					//						extras: {
					//							good_id: id
					//						}
					//					});
				});

				mui("#mui-template5").on('tap', 'img', function(e) {
					var id = this.getAttribute("id");
					mui.openWindow({
						url: 'goods_info.html',
						id: 'goods_info.html',
						extras: {
							good_id: id
						}
					});
				});

				window.addEventListener('changeCity', function(event) {
					if(event) {
						var cityCode = event.detail.cityCode; //市id
						city_id = cityCode;
					}

				});

				window.addEventListener('openPop', function(event) {
					window.scrollTo(0, 0);
					mui('#popover').popover('show');
				});