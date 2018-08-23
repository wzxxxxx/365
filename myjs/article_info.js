			mui.plusReady(function() {
				var currentView = plus.webview.currentWebview();
				currentView.show('slide-in-right', 200);
				plus.nativeUI.closeWaiting();
				var id = currentView.ar_id;
				getArticleInfo(id);
			})

			function getArticleInfo(id) {
				var data = {
					service: 'Hlbr365app.Article.GetArticleInfo',
					ar_id: id
				};
				mui.ajax({
					url: makeurl(data),
					data: {},
					type: 'get', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(data) {
						if(isRequestSuccess) {
							console.log(JSON.stringify(data));
							var info = data.data.info;
							document.getElementById('title').innerHTML = info.ar_title;
							document.getElementById('time').innerHTML = new Date(1000 * info.ar_time).toLocaleDateString();
							document.getElementById('read').innerHTML = info.ar_reads + ' 阅览';
							document.getElementById('content').innerHTML = info.ar_content;
//							document.getElementById('img').src = info.ar_image;
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						console.log(type);
					}
				});
			}
