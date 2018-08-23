			mui.plusReady(function(){
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_number = loginData.data.info.mbi_number;
				getMyCoupon(mbi_number);
				
//				document.getElementById('confirm').addEventListener('tap', function(){
//					getMyCoupon(mbi_number, 'byCode', document.getElementById('code').value);
//				})
			})
			
			function getMyCoupon(mbi_number, type, value){
				var couponParam = {
					service: 'Hlbr365app.Member.GetMyCouponList',
					mbi_number: mbi_number,
					firstRow: 1,
					listRows: 20
				}
				if(type == 'byCode'){
					couponParam.cc_code = value;
				}
				wAjax(couponParam, function(result){
					
				})
			}
			mui("#popover").on('tap', 'a', function(e) {
				var wt = plus.nativeUI.showWaiting('正在加载...', {
					width: '40%',
					height: '20%',
					padding: '10%',
					background: "rgba(255,255,255,0)",
					style: 'black',
					color: "rgba(0,0,0,1)"
				});
				setTimeout(function(){
					plus.nativeUI.closeWaiting();
				}, 200)
				mui('#popover').popover('hide');

			});
			mui("#popover2").on('tap', 'a', function(e) {
				var wt = plus.nativeUI.showWaiting('正在加载...', {
					width: '40%',
					height: '20%',
					padding: '10%',
					background: "rgba(255,255,255,0)",
					style: 'black',
					color: "rgba(0,0,0,1)"
				});
				setTimeout(function(){
					plus.nativeUI.closeWaiting();
				}, 200)
				mui('#popover2').popover('hide');

			});
			mui("#popover3").on('tap', 'a', function(e) {
				var wt = plus.nativeUI.showWaiting('正在加载...', {
					width: '40%',
					height: '20%',
					padding: '10%',
					background: "rgba(255,255,255,0)",
					style: 'black',
					color: "rgba(0,0,0,1)"
				});
				setTimeout(function(){
					plus.nativeUI.closeWaiting();
				}, 200)
				mui('#popover3').popover('hide');

			});

