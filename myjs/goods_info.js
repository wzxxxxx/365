			var isCollect = 1;
			var shares = null;
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				self.show('slide-in-right', 300);
				plus.nativeUI.closeWaiting();
				updateSerivces();
				
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				
				var mbi_id = loginData.data.info.mbi_id || '';
				var good_id = self.good_id || '';
				getGoodInfo(good_id, mbi_id);
				getCommentList(good_id);
				document.getElementById('lijilingqu').addEventListener('tap', function() {
					mui('#sheet1').popover('toggle');
				})
				document.getElementById('noticeImg').addEventListener('tap', function(){
					shareShow();
				})
			})
			
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

			function getCommentList(good_id) {
				var commentParam = {
					service: 'Hlbr365app.Goods.GetCommentList',
					jg_id: good_id,
					firstRow: 1,
					listRows: 20
				}
				var commentNo = document.getElementById('commentNo');
				commentNo.addEventListener('tap', function() {
					mui.openWindow({
						url: 'comment_list.html',
						id: 'comment_list.html',
						extras: {
							good_id: good_id
						}
					})
				})
				wAjax(commentParam, function(result) {
					var clist = result.data.list;

					commentNo.innerHTML = "" + clist.length + '条评论';
					var str = template('temp2', {
						"record": clist
					});
					document.getElementById("mui-template2").innerHTML = str;
				})
			}

			function getSameGoods(good_id, type_id) {
				var sameGoodsParam = {
					service: 'Hlbr365app.Goods.GetSameServiceList',
					jg_id: good_id,
					two_type_id: type_id,
					city_id: 150702,
					firstRow: 1,
					listRows: 20
				}
				wAjax(sameGoodsParam, function(result) {
					var goodsList = result.data.list;
					var str = template('temp', {
						'record': goodsList
					});
					document.getElementById('mui-template').innerHTML = str;
				})
			}

			function getGoodInfo(good_id, mbi_id) {

				var collectImg = document.getElementById('collectImg');
				document.getElementById('collect').addEventListener('tap', function() {
					collectGood(mbi_id, good_id);
				})

				document.getElementById('arrange').addEventListener('tap', function() {
					mui.openWindow({
						url: 'order_confirm.html',
						id: 'order_confirm.html',
						extras: {
							good_id: good_id
						}
					});
				})

				var getGoodParam = {
					service: 'Hlbr365app.Goods.GetGoodsInfo',
					jg_id: good_id
				}
				wAjax(getGoodParam, function(result) {
					var info = result.data.info;
					document.getElementById('good_img').src = info.jg_img || 'images/img16.png';
					document.getElementById('good_name').innerHTML = info.jg_name;
					document.getElementById('good_intro').innerHTML = info.jg_intro;
					document.getElementById('price').innerHTML = info.jg_price;
					document.getElementById('start_price').innerHTML = info.jg_price_start;
					isCollect = info.isCollect;
					var type_id = info.two_type_id;
					var coupon = info.coupon;
					document.getElementById('counpon').hidden = coupon.length < 1;
					
					getSameGoods(good_id, type_id);

					document.getElementById('shopInfo').addEventListener('tap', function() {
						mui.openWindow({
							url: 'shop_info.html',
							id: 'shop_info.html',
							extras: {
								shop_id: info.jci_id
							}
						})
					})

					if(isCollect == 1) {
						collectImg.src = "images/ic_comment_press.png";
					} else if(isCollect == 2) {
						collectImg.src = "images/ic_comment_normal.png";
					}
					// 实体字符转换
					var ele = document.createElement('div');
					ele.innerHTML = info.jg_content;
					document.getElementById('info').innerHTML = ele.innerText;
					plus.nativeUI.closeWaiting();
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
						collectImg.src = "images/ic_comment_press.png";
						isCollect = 1;
						plus.nativeUI.toast('添加收藏成功!');
					} else if(action == 2) {
						collectImg.src = "images/ic_comment_normal.png";
						isCollect = 2;
						plus.nativeUI.toast('取消收藏成功!');
					}
					//					isCollect = !isCollect;
				})
			}

			mui("#mui-template").on('tap', 'img', function(e) {
				var id = this.getAttribute("id");
				window.scrollTo(0, 0);
				showWaiting();
				setTimeout(function() {
					getGoodInfo(id);
				}, 100)

				//					mui.refresh();
				//					plus.webview.currentWebview().reload();

				//					mui.openWindow({
				//						url: 'goods_info.html',
				//						id: 'goods_info.html',
				//						extras: {
				//							good_id: id
				//						}
				//					});
			});
