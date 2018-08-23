			mui.plusReady(function() {
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}

				var mbi_id = loginData.data.info.mbi_id;
				var collectionParam = {
					service: 'Hlbr365app.Member.GetMyCollectList',
					mbi_id: loginData.data.info.mbi_id,
					jc_type: 1,
					firstRow: 1,
					listRows: 20
				}
				wAjax(collectionParam, function(result) {
					var collectionList = result.data.list;
					if(collectionList.length < 1){
						document.getElementById('mui-template').setAttribute('class', 'mui-hidden');
						document.getElementById('no_content').setAttribute('class', '');
					} else {
						var str = template('temp', {
						'record': collectionList
					});
					
					document.getElementById("mui-template").innerHTML = str;
					}
					
				})

				mui("#mui-template").on('tap', 'a', function(e) {
					var id = this.getAttribute("id");
						mui.openWindow({
						url: 'goods_info.html',
						id: 'goods_info.html',
						extras: {
							good_id: id
						} //自定义扩展参数
					});
//					type_id = id;
//					getGoodsList();
//					document.getElementById('openPopove2r').innerHTML = this.innerHTML + '<img src="images/img18.png" class="list-down-img"/><span class="fengeline">|</span>';
//					mui('#popover2').popover('hide');

				});

			})
