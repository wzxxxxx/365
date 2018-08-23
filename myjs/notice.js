			mui.plusReady(function(){
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
				getAllNotice(mbi_id);
			})
			
			function getAllNotice(mbi_id){
				var noticeParam = {
					service: 'Hlbr365app.Message.ReadAllInfo',
					mbi_id: mbi_id
				}
				wAjax(noticeParam, function(result){
					
				})
				
			}
