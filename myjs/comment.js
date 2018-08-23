			var companyCom = 0,
				peopleCom = 0;

			mui.plusReady(function() {
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
				var self = plus.webview.currentWebview();
				var ob_id = self.ob_id || '';
				var company_id = self.company_id || '';
				var og_id = self.og_id || '';
				document.getElementById('arrange').addEventListener('tap', function(){
					submitComment(mbi_id, ob_id, company_id, og_id);
				})
//				submitComment(mbi_id, ob_id, company_id, og_id);
				
			})
			mui('#fiveStars').on('tap', 'img', function() {
				var index = parseInt(this.getAttribute("data-index")); //获取当前元素的索引值
				companyCom = index;
				var parent = this.parentNode; //获取当前元素的父节点
				var children = parent.children; //获取父节点下所有子元素
				if(this.src.slice(-21) == "ic_comment_normal.png") { //判断当前节点列表中是否含有.mui-icon-star元素
					for(var i = 0; i < index; i++) { //亮星
						children[i].src = "images/ic_comment_press.png"
						//              children[i].classList.remove('mui-icon-star');
						//              children[i].classList.add('mui-icon-star-filled');
					}
				} else { //重置已经亮星的元素
					for(var i = index; i < 5; i++) {
						children[i].src = "images/ic_comment_normal.png"
						//          children[i].classList.add('mui-icon-star')
						//          children[i].classList.remove('mui-icon-star-filled')
					}
				}
				//  document.getElementById("info").innerHTML = parent.previousElementSibling.innerText  + "：" + index "星好评";
			})
			mui('#fiveStars_2').on('tap', 'img', function() {
				var index = parseInt(this.getAttribute("data-index"));
				peopleCom = index;
				var parent = this.parentNode;
				var children = parent.children;
				if(this.src.slice(-21) == "ic_comment_normal.png") {
					for(var i = 0; i < index; i++) {
						children[i].src = "images/ic_comment_press.png"
						//              children[i].classList.remove('mui-icon-star');
						//              children[i].classList.add('mui-icon-star-filled');
					}
				} else {
					for(var i = index; i < 5; i++) {
						children[i].src = "images/ic_comment_normal.png"
						//          children[i].classList.add('mui-icon-star')
						//          children[i].classList.remove('mui-icon-star-filled')
					}
				}
				//  document.getElementById("info").innerHTML = parent.previousElementSibling.innerText  + "：" + index "星好评";
			})

			function submitComment(mbi_id, ob_id, company_id, og_id) {
				var content = document.getElementById('commentContent').value;
				var commentParam = {
					service: 'Hlbr365app.Goods.PushComment',
					mbi_id: mbi_id,
					ob_id: ob_id,
					jg_id: og_id,
					jci_id: company_id,
					jzc_level: peopleCom,
					jci_level: companyCom,
					jzc_type: 1,
					jzc_pid: 0,
					jzc_content: content
				}
				wAjax(commentParam, function(result){
					plus.nativeUI.toast('提交成功！');
					mui.back();
				})
			}
