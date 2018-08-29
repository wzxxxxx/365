			mui.init({
			    pullRefresh: {
			        container: '#pullrefresh',
			        down: {
			            style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			            auto: false, //可选,默认false.首次加载自动上拉刷新一次
			            callback: pulldownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			        },
			        up: {
			            auto: false,
			            contentrefresh: '正在加载...',
			            callback: pullupRefresh
			        }
			    }
			});


			mui.plusReady(function () {

			    var self = plus.webview.currentWebview();
			    var list = self.list || [];
			    fillData(list, true);

			})

			function fillData(list, isDown) {
			    for (var i = 0; i < list.length; i++) {
			        list[i].user_predict_work_time = new Date(list[i].user_predict_work_time * 1000).toLocaleString();
			        list[i].ob_time = new Date(list[i].ob_time * 1000).toLocaleString();
			    }
			    var str = template('temp', {
			        "record": list
			    });


			    if (str.trim()) pageIndex++;
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			    document.getElementById('item1_1_null').hidden = pageIndex - 1 || str.trim();
				if(!(document.getElementById('item1_1_null')).hidden) mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
// 			    document.getElementById('item1_1_null').hidden ? mui('#pullrefresh').pullRefresh().enablePullupToRefresh() : mui(
// 			        '#pullrefresh').pullRefresh().disablePullupToRefresh();
			    isDown ? document.getElementById("mui-template").innerHTML = str : $("#mui-template").append(str);
			    list.length < 10 ? mui('#pullrefresh').pullRefresh().endPullupToRefresh(true) : mui('#pullrefresh').pullRefresh()
			        .endPullupToRefresh();

			}


			function getOrder(isDown) {
			    if (isDown) pageIndex = 1;
			    var loginData = JSON.parse(localStorage.getItem('login'));
			    var mbi_number = loginData.data.info.mbi_id;
			    var orderParam = {
			        service: 'Hlbr365app.Member.GetMyOrderList',
			        mbi_number: mbi_number,
			        firstRow: pageIndex,
			        listRows: 10
			    };
			    wAjax(orderParam, function (result) {
			        var list = result.data.list;
			        fillData(list, isDown);
			    });
			}

			var pageIndex = 1;

			function pullupRefresh() {
			    setTimeout(function () {
			        getOrder(false);
			    }, 1000);
			}

			function pulldownRefresh() {
			    getOrder(true);

			}

			mui("#mui-template").on('tap', '.mui-content', function (e) {
			    var order_id = this.getAttribute("id");
			    mui.openWindow({
			        url: 'order_detail.html',
			        id: 'order_detail.html',
			        extras: {
			            order_id: order_id
			        }
			    })

			});
