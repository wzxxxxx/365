			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				var good_id = self.good_id || '';
				getCommentList(good_id);
			});

			function getCommentList(good_id) {
				var commentParam = {
					service: 'Hlbr365app.Goods.GetCommentList',
					jg_id: good_id,
					firstRow: 1,
					listRows: 20
				}
				wAjax(commentParam, function(result) {
					var clist = result.data.list;
					var str = template('temp', {
						"record": clist
					});
					document.getElementById("mui-template").innerHTML = str;
				})
			}
