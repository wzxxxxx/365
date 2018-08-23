			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				if(self.order_id) {
					getOrderInfo(self.order_id);
				}
			})

			function getOrderInfo(ob_id) {
				var getOrderParam = {
					service: 'Hlbr365app.Order.GetOrderInfo',
					ob_id: ob_id
				};
				wAjax(getOrderParam, function(result) {
					var info = result.data.info;
					document.getElementById('name').innerHTML = '联系人：' + info.user_contacts_name;
					document.getElementById('phoneNumber').innerHTML = '联系电话：' + info.user_contacts_phone;
					document.getElementById('address').innerHTML = '联系地址：' + info.user_contacts_province_name +
						info.user_contacts_city_name + info.user_contacts_county_name + info.user_contacts_address;
					document.getElementById('time').innerHTML = new Date(1000 * info.user_predict_work_time).toLocaleString();
//					document.getElementById('server').innerHTML = info.customer_user_name;
					document.getElementById('goodName').innerHTML = info.company_name;
					document.getElementById('goodIntro').innerHTML = info.goods.og_goods_name;
					document.getElementById('remark').innerHTML = info.ob_comment_remark;
					if(info.staff){
						document.getElementById('server').innerHTML = info.staff.os_staff_real_name;
					}
					document.getElementById('serverPeople').addEventListener('tap', function(){
						plus.device.dial(info.staff.os_staff_phone, false);
					})
					if(info.pay){
						document.getElementById('price').innerHTML = info.pay.op_actual_price + '元';
					}

					var bottomBtn = document.getElementById('bottomButton');
					var prompt = document.getElementById('prompt');
					var serverPeople = document.getElementById('serverPeople');
					if(info.ob_status == 1 || info.ob_status == 2) {
						bottomBtn.setAttribute('class', 'mui-btn mui-pull-right');
						serverPeople.setAttribute('class', 'mui-hidden');
						bottomBtn.innerHTML = '取消订单';
						prompt.innerHTML = '等待商家确认订单,请耐心等候.';
						bottomBtn.addEventListener('tap', function() {
							mui('#sheet1').popover('show');
						})
					} else if(info.ob_status == 6 || info.ob_status == 7) {
						bottomBtn.setAttribute('class', 'mui-btn mui-pull-right');
						bottomBtn.innerHTML = '去评价';
						prompt.innerHTML = '待评价';
						document.getElementById('price').setAttribute('class', 'mui-hidden');
						bottomBtn.addEventListener('tap', function(){
							mui.openWindow({
								url: 'comment.html',
								id: 'comment.html',
								extras: {
									ob_id: ob_id,
									company_id: info.company_id,
									og_id:info.goods.og_goods_id
									
								}
							})
						})
					} else if(info.ob_status == 5) {
						bottomBtn.setAttribute('class', 'mui-btn mui-pull-right');
						bottomBtn.innerHTML = '去支付';
						prompt.innerHTML = '待付款';
						bottomBtn.addEventListener('tap', function(){
							createOrder(info.ob_number);
						})
					} else if(info.ob_status == 3) {
						prompt.innerHTML = '商家已指派工作人员.';
					} else if(info.ob_status == 4) {
						prompt.innerHTML = '工作人员已在工作中.';
					} else if(info.ob_status == 8 || info.ob_status == 14) {
						prompt.innerHTML = '已完成！';
						document.getElementById('price').hidden = true;
					} else if(info.ob_status == 12) {
						prompt.innerHTML = '商家已取消订单！' + info.ob_enterprise_cancel_remark;
						serverPeople.setAttribute('class', 'mui-hidden');
						document.getElementById('price').hidden = true;
					} else if(info.ob_status == 13) {
						prompt.innerHTML = '用户已取消订单！' + info.ob_client_cancel_remark;
						serverPeople.setAttribute('class', 'mui-hidden');
						document.getElementById('price').hidden = true;
					}
				})
			}

			function cancelOrder(reason) {
				var self = plus.webview.currentWebview();
				var ob_id = self.order_id || '';
				var cacelParam = {
					service: 'Hlbr365app.Order.CancelOrder',
					ob_id: ob_id,
					remark: reason
				}
				wAjax(cacelParam, function() {
					var orderList = self.opener();
					orderList.reload();
					mui.back();
				})
			}
			
			mui("#sheet1").on('tap', 'a', function(e) {
				var reason = this.innerHTML;
				cancelOrder(reason);
			});
			
			function createOrder(ob_number){
				var createOrderParam = {
					service: 'Hlbr365app.Order.PayOrder',
					ob_number: ob_number,
					op_pay_mode: 3
				}
				wAjax(createOrderParam, function(result){
					var html = result.data.info;
					console.log(html);
					document.getElementById('submitOrder').innerHTML = html;
					setTimeout(function(){
						document.forms['alipaysubmit'].submit();
					}, 500);
//					aliUrl = result.data.info.ali;
//					payOrder(ob_number);
				})
			}


			var pays = [], aliUrl = '';
			function payOrder(ob_number) {
//				createOrder(ob_number);
				
				
				plus.payment.getChannels(function(channels) {
//					var content = document.getElementById('dcontent');
//					var info = document.getElementById('info');
//					var txt = '支付通道信息：';
					for(var i in channels) {
						var channel = channels[i];
						if(channel.id == 'qhpay' || channel.id == 'qihoo') { // 过滤掉不支持的支付通道：暂不支持360相关支付
							continue;
						}
						pays[channel.id] = channel;
//						txt += 'id:' + channel.id + ', ';
//						txt += 'description:' + channel.description + ', ';
//						txt += 'serviceReady:' + channel.serviceReady + '； ';
//						var de = document.createElement('div');
//						de.setAttribute('class', 'button');
//						de.setAttribute('onclick', 'pay(this.id)');
//						de.id = channel.id;
//						de.innerText = channel.description + '支付';
//						content.appendChild(de);
						if(channel.id == 'alipay'){
							checkServices(channel);
						}
						
					}
//					info.innerText = txt;
				}, function(e) {
					outLine('获取支付通道失败：' + e.message);
				});
			}

				var w = null;
			var PAYSERVER = 'http://365gateway.lanyukj.cn/public/index.php?';
			
			// 检测是否安装支付服务
			function checkServices(pc) {
				if(!pc.serviceReady) {
					var txt = null;
					switch(pc.id) {
						case 'alipay':
							txt = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？';
							break;
						default:
							txt = '系统未安装“' + pc.description + '”服务，无法完成支付，是否立即安装？';
							break;
					}
					plus.nativeUI.confirm(txt, function(e) {
						if(e.index == 0) {
							pc.installService();
						}
					}, pc.description);
				} else {
					pay('alipay', document.getElementById('price').innerHTML);
				}
			}
			
			// 支付
			function pay(id, price) {
				if(w) {
					return;
				} //检查是否请求订单中
//				if(id === 'appleiap') {
//					outSet('应用内支付');
//					clicked('payment_iap.html');
//					return;
//				}
//				outSet('----- 请求支付 -----');
				var url = PAYSERVER;
//				if(id == 'alipay' || id == 'wxpay') {
//					url += id;
//				} else {
//					plus.nativeUI.alert('当前环境不支持此支付通道！', null, '捐赠');
//					return;
//				}
//				var appid = plus.runtime.appid;
//				if(navigator.userAgent.indexOf('StreamApp') >= 0) {
//					appid = 'Stream';
//				}
//				url += '&appid=' + appid + '&total=';
				url += aliUrl;
				w = plus.nativeUI.showWaiting();
				// 请求支付订单
				var amount = price;
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					switch(xhr.readyState) {
						case 4:
							w.close();
							w = null;
							if(xhr.status == 200) {
								console.log('----- 请求订单成功 -----');
								console.log(xhr.responseText);
								var order = xhr.responseText;
								plus.payment.request(pays[id], order, function(result) {
									console.log('----- 支付成功 -----');
									console.log(JSON.stringify(result));
									plus.nativeUI.alert('支付成功：感谢你的支持，我们会继续努力完善产品。', function() {
										back();
									}, '捐赠');
								}, function(e) {
									console.log('----- 支付失败 -----');
									console.log('[' + e.code + ']：' + e.message);
									plus.nativeUI.alert('更多错误信息请参考支付(Payment)规范文档：http://www.html5plus.org/#specification#/specification/Payment.html', null, '支付失败：' + e.code);
								});
							} else {
								console.log('----- 请求订单失败 -----');
								console.log(xhr.status);
								plus.nativeUI.alert('获取订单信息失败！', null, '捐赠');
							}
							break;
						default:
							break;
					}
				}
				xhr.open('GET', url);
				console.log('请求支付订单：' + url );
				xhr.send();
			}
