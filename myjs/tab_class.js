			var types = [];

			mui.plusReady(getTypeList);

			window.addEventListener('toClass', function (event) {
			    if (event) {
			        for (var i = 0; i < types.length; i++) {
			            if (types[i].at_id == event.detail.typeId) {
			                var eleArr = document.querySelectorAll(".fuck");
			                for (var i = 0; i < eleArr.length; i++) {
			                    eleArr[i].setAttribute('class', 'fuck');
			                }
			                var ele = document.getElementsByName(event.detail.typeId)[0];
			                ele.setAttribute('class', 'fuck mui-active');
			                mui.trigger(ele, 'tap');
			            }
			        }
			    }
			});

			function getTypeList() {

			    var data = {
			        service: 'Hlbr365app.Article.GetTypeList'
			    };
				
// 			    mui.ajax({
// 			        url: makeurl(data),
// 			        data: {},
// 			        type: 'get', //HTTP请求类型
// 			        timeout: 10000, //超时时间设置为10秒；
// 			        success: function (data) {
// 			            if (isRequestSuccess(data)) {
// 			                var list = data.data.list;
// 			                if (list && list.length > 0) {
// 			                    for (var i = 0; i < list.length; i++) {
// 			                        types.push(list[i]);
// 			                    }
// 			                    var str = template('temp', {
// 			                        "record": types
// 			                    });
// 			                    document.getElementById("mui-template").innerHTML = str;
// 			                    document.querySelector('.fuck').setAttribute('class', 'fuck mui-active');
// 			                    getArticleList(types[0].at_id);
// 			                }
// 			            }
// 			        },
// 			        error: function (xhr, type, errorThrown) {
// 			            //异常处理；
// 			            console.log(type);
// 			        }
// 			    });
				
				wAjax(data, function(result){
					var list = result.data.list;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							types.push(list[i]);
						}
						var str = template('temp', {
							"record": types
						});
						document.getElementById("mui-template").innerHTML = str;
						document.querySelector('.fuck').setAttribute('class', 'fuck mui-active');
						getArticleList(types[0].at_id);
					}
				})


			}

			function getArticleList(id) {
			
						    var data = {
						        service: 'Hlbr365app.Article.GetArticleList',
						        at_id: id,
						        firstRow: 1,
						        listRows: 20
						    };
			
						    wAjax(data, function (result) {
						            var list = result.data.list;
						            // if (list && list.length > 0) {
						                
						                for (var i = 0; i < list.length; i++) {
						                    list[i].ar_time = new Date(1000 * list[i].ar_time).toLocaleDateString();
						                }
						                var str = template('temp2', {
						                    "record": list
						                });
			
						                document.getElementById("mui-template2").innerHTML = str;
										document.getElementById('no_content').hidden = list.length > 0;
						                plus.nativeUI.closeWaiting();
			// 			            } else {
			// 			                document.getElementById('no_content').setAttribute('class', '');
			// 							plus.nativeUI.closeWaiting();
			// 
			// 			            }
						    })
						}
			
			// articles = [];
			// 				mui.ajax({
			// 					url: makeurl(data),
			// 					data: {},
			// 					type: 'get', //HTTP请求类型
			// 					timeout: 10000, //超时时间设置为10秒；
			// 					success: function(data) {
			// 						if(isRequestSuccess(data)) {
			// 							var list = data.data.list;
			// 							if(list && list.length > 0) {
			// 								document.getElementById('no_content').setAttribute('class', 'mui-hidden');
			// 								for(var i = 0; i < list.length; i++) {
			// 									list[i].ar_time = new Date(1000 * list[i].ar_time).toLocaleDateString();
			// 									// articles.push(list[i]);
			// 								}
			// // 								var ele = document.createElement('div');
			// // 								for(var i = 0; i < articles.length; i++) {
			// // 									ele.innerHTML = articles[i].ar_content;
			// // 									articles[i].ar_content = ele.innerText;
			// // 								}
			// 								// template.config('escape', false);
			// 								var str = template('temp2', {
			// 									"record": list
			// 								});
			// 
			// 								document.getElementById("mui-template2").innerHTML = str;
			// 								plus.nativeUI.closeWaiting();
			// 							} else {
			// 								document.getElementById('no_content').setAttribute('class', '');
			// 								plus.nativeUI.closeWaiting();
			// 							}
			// 						}
			// 					},
			// 					error: function(xhr, type, errorThrown) {
			// 						//异常处理；
			// 						console.log(type);
			// 						plus.nativeUI.closeWaiting();
			// 						plus.nativeUI.toast('网络连接错误');
			// 						return;
			// 					}
			// 				});
			// 
			// 			}

			mui("#mui-template2").on('tap', 'li', function (e) {
			    var id = this.getAttribute("name");
			    mui.openWindow({
			        url: 'article_info.html',
			        id: 'article_info',
			        extras: {
			            ar_id: id
			        },
			        show: {
			            autoShow: false, //页面loaded事件发生后自动显示，默认为true
			            event: 'loaded' //页面显示时机，默认为titleUpdate事件时显示
			        },
			        waiting: {
			            autoShow: true //自动显示等待框，默认为true
			        }
			    });
			});

			mui(".mui-content").on('tap', '.fuck', function (e) {
			    showWaiting();
			    var eleArr = document.querySelectorAll(".fuck");
			    for (var i = 0; i < eleArr.length; i++) {
			        eleArr[i].setAttribute('class', 'fuck');
			    }
			    //							var ele = document.getElementsByName(event.detail.typeId)[0];
			    this.setAttribute('class', 'fuck mui-active');
			    //							mui.trigger(ele, 'tap');
			    // document.getElementById("mui-template2").innerHTML = '';
			    var id = this.getAttribute("name");
			    getArticleList(id);
			});
