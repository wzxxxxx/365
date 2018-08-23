			mui.plusReady(function(){
				var param = {
					service: 'Jzxt.AboutMe.GetDetails'
				}
				wAjax(param, function(result){
					var content = result.data.info.jz_note;
					var ele = document.createElement('div');
					ele.innerHTML = content;
					document.getElementById('aboutus').innerHTML = ele.innerText;
//					document.getElementById('aboutus').innerHTML = content;
				})
			})
