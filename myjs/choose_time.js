			mui.plusReady(function() {
				var myDate = new Date();
				var xingqi = myDate.getDay();
				var xingqiArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				var dateArr = [];
				for(var i = 0;i < 7; i++ ) {
					var item = {
						xingqi: xingqiArr[xingqi - 1],
						myDate: getTomorrow(myDate)
					}
					dateArr.push(item);
				}
				var str = template('temp', {
					"record": dateArr
				});
				document.getElementById("mui-template").innerHTML = str;

			})

			function getTomorrow(myDate) {
				myDate.setDate(myDate.getDate() + 1);
				return myDate.toLocaleDateString();
			}
