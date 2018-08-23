			var isCollect = 1;
			var shares = null;
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				var shop_id = self.shop_id;
				if(shop_id) {
						getShopInfo(shop_id);
						getGoodsList(shop_id);
				}
				updateSerivces();
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;

				var collectImg = document.getElementById('collectImg');
				document.getElementById('collect').addEventListener('tap', function() {
					collectGood(mbi_id, shop_id);
					//					if(isCollect){
					//						collectImg.src = "images/img74.png";
					//					}else{
					//						collectImg.src = "images/img81.png";
					//					}
				})
				document.getElementById('lijilingqu').addEventListener('tap', function(){
					mui('#sheet1').popover('toggle');
				})
				document.getElementById('noticeImg').addEventListener('tap', function(){
					shareShow();
				})

//				document.getElementById('arrange').addEventListener('tap', function() {
//					mui.openWindow({
//						url: 'order_confirm.html',
//						id: 'order_confirm.html',
//						extras: {
//							good_id: good_id
//						}
//					});
//				})
			})

			function getShopInfo(shop_id) {
				var getGoodParam = {
					service: 'Hlbr365app.Goods.GetCompanyInfo',
					jci_id: shop_id
				}
				wAjax(getGoodParam, function(result) {
					var info = result.data.info;
//					document.getElementById('title').innerHTML = info.jci_name;
					document.getElementById('good_img').src = info.jci_logo;
					document.getElementById('good_name').innerHTML = info.jci_name;
					document.getElementById('intro').innerHTML = info.jci_intro;
//					document.getElementById('price').innerHTML = info.jg_price;
//					document.getElementById('start_price').innerHTML = info.jg_price_start;
					isCollect = info.isCollect;
					var couponList = info.coupon;
					document.getElementById('counpon').hidden = couponList.length < 1;

					if(isCollect == 1) {
						collectImg.src = "images/img81.png";
					} else if(isCollect == 2) {
						collectImg.src = "images/img74.png";
					}
					// 实体字符转换
//					var ele = document.createElement('div');
//					ele.innerHTML = info.jg_content;
//					document.getElementById('info').innerHTML = ele.innerText;
				})
			}
			
			function getGoodsList(shop_id) {
				//				var goodsListWithInfo = [];
				var goodsParam = {
					service: 'Hlbr365app.Goods.GetServiceList',
					jci_id: shop_id,
					firstRow: 1,
					listRows: 20
				}
//				if(name != '') {
//					goodsParam.name = name;
//				} else {
//					goodsParam.two_type_id = type_id;
//					goodsParam.city_id = country_id;
//				}
				wAjax(goodsParam, function(result) {
					var goodsList = result.data.list;

					var str = template('temp', {
						'record': goodsList
					});
					document.getElementById("mui-template").innerHTML = str;

				})
			}

			function collectGood(mbi_id, good_id) {
				var action = (isCollect == 1) ? 2 : 1;
				var collectParam = {
					service: 'Hlbr365app.Goods.SetCollect',
					mbi_id: mbi_id,
					jc_type: 1,
					jc_wid: good_id,
					action: action
				};
				wAjax(collectParam, function(result) {
					if(action == 1) {
						collectImg.src = "images/img81.png";
						isCollect = 1;
					} else if(action == 2) {
						collectImg.src = "images/img74.png";
						isCollect = 2;
					}
					//					isCollect = !isCollect;
				})
			}
			
			mui("#mui-template").on('tap', 'a', function(e) {
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
						} //自定义扩展参数
					});
				}
			});
			
			function updateSerivces() {
				plus.share.getServices(function(s) {
					shares = {};
					for(var i in s) {
						var t = s[i];
						shares[t.id] = t;
					}
				}, function(e) {
					console.log('获取分享服务列表失败：' + e.message);
				});
			}
			function shareShow() {
				var shareBts = [];
				// 更新分享列表
				var ss = shares['weixin'];
				// if(navigator.userAgent.indexOf('qihoo') < 0) { //在360流应用中微信不支持分享图片
					ss && ss.nativeClient && (shareBts.push({
							title: '微信朋友圈',
							s: ss,
							x: 'WXSceneTimeline'
						}),
						shareBts.push({
							title: '微信好友',
							s: ss,
							x: 'WXSceneSession'
						}));
				// }
				ss = shares['qq'];
				ss && ss.nativeClient && shareBts.push({
					title: 'QQ',
					s: ss
				});
				// 弹出分享列表
				shareBts.length > 0 ? plus.nativeUI.actionSheet({
					title: '分享',
					cancel: '取消',
					buttons: shareBts
				}, function(e) {
					(e.index > 0) && shareAction(shareBts[e.index - 1], false);
				}) : plus.nativeUI.alert('当前环境无法支持分享操作!');
			}
			
			function shareAction(sb, bh) {
				console.log('分享操作：');
				if(!sb || !sb.s) {
					console.log('无效的分享服务！');
					return;
				}
				var msg = {
					content: "test",
					extra: {
						scene: sb.x
					}
				};
				// 发送分享
				if(sb.s.authenticated) {
					console.log('---已授权---');
					shareMessage(msg, sb.s);
				} else {
					console.log('---未授权---');
					sb.s.authorize(function() {
						shareMessage(msg, sb.s);
					}, function(e) {
						console.log('认证授权失败：' + e.code + ' - ' + e.message);
					});
				}
			}
			
			function shareMessage(msg, s) {
				console.log(JSON.stringify(msg));
				s.send(msg, function() {
					console.log('分享到"' + s.description + '"成功！');
				}, function(e) {
					console.log('分享到"' + s.description + '"失败: ' + JSON.stringify(e));
				});
			}
