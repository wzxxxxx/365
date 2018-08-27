			mui.plusReady(function() {
				var loginData = JSON.parse(localStorage.getItem('login'));
				if(!loginData) {
					return;
				}
				var mbi_id = loginData.data.info.mbi_id;
				getProfile(mbi_id);

				var avatarData = localStorage.getItem('HEAD_PHOTO');
				//保存修改
				document.getElementById('save').addEventListener('tap', function() {
					var param = {
						service: 'Publics.UploadImg.Uploadimg',
						imgdata: avatarData
					}
					var url = makeurl(param, false, true);
					mui.ajax("http://365gateway.lanyukj.cn/public/index.php", {
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						data: url,
						success: function(data) {
							if(isRequestSuccess(data)) {
								var imgUrl = data.data.info[0];
								editProfile(imgUrl, mbi_id);
							} else {
								editProfile(null, mbi_id);
							}
						},
						error: function(xhr, type, errorThrown) {
							//异常处理；
							console.log(type);
							return;
						}
					});

				})
			})

			function editProfile(imgUrl, mbi_id) {
				var user_name = document.getElementById('user_name').innerHTML;
				var sex = document.getElementById('sex').innerHTML;
				var birth = document.getElementById('birth').innerHTML;
				var editParam = {
					service: 'Hlbr365app.Member.Edit',
					mbi_id: mbi_id
					//					mei_real_name: user_name.value,
					//					mei_head: imgUrl
					//					mei_sex: ,
					//					mei_birth: 
				};
				if(imgUrl) {
					editParam.mei_head = imgUrl;
				}
				if(user_name) editParam.mei_real_name = user_name;
				if(sex) editParam.mei_sex = sex == '男' ? 1 : 2;
				if(birth) editParam.mei_birth = (new Date(birth).getTime()) / 1000 ;
				wAjax(editParam, function(result) {
					plus.webview.getWebviewById('tab_mine.html').reload();
					plus.nativeUI.toast('修改地址成功！');
					mui.back();
				})
			}
			//			function uploadImg(img64){
			//				var imgParam = {
			//					service: 'Publics.UploadImg.Uploadimg',
			//					imgdata: img64
			//				}
			//				wAjax(imgParam, function(result){
			//					
			//				})

			//		wAjax(img64, )
			//		var wt = plus.nativeUI.showWaiting();
			//		mui.ajax('https://365image.lanyukj.cn/index.php/Upload/jzUpload', {
			////			dataType: 'json',
			//			type: 'post', //HTTP请求类型
			//			timeout: 10000, //超时时间设置为10秒；
			//			data: img64,
			////			headers: {
			////				'Content-Type': 'application/json'
			////			},
			//			success: function(data) {
			//				wt.close();
			//				if(data) {
			//					return data;
			//				}
			//			},
			//			error: function(xhr, type, errorThrown) {
			//				//异常处理；
			//				console.log(type);
			//				wt.close();
			//				return;
			//			}
			//		});
			//	}

			// 姓名
			document.getElementById("geren_name").addEventListener("tap", function() {
				var oldName = document.getElementById('user_name').innerHTML;
				mui.prompt(' ', oldName, '请输入', ['取消', '确定'], function(event) {
					if(event.value && event.index == 1) {
						document.getElementById('user_name').innerHTML = event.value;
					}
				})
				//	var geren_name = localStorage.getItem('GEREN_NAME') == null ? "" : localStorage.getItem('GEREN_NAME');
				// 设定等待动画框，新页面加载完毕后再显示
				//	var nwaiting = plus.nativeUI.showWaiting();
				//	var webviewShow = plus.webview.create('name.html', 'name');
				//	var name = plus.webview.getWebviewById('name');
				//	name.addEventListener('loaded', function() {
				//		mui.fire(name, "user_name", {
				//			GEREN_NAME: geren_name
				//		});
				//	});

			});

			function getProfile(id) {
				var profileParam = {
					service: 'Hlbr365app.Member.GetInfo',
					mbi_id: id
				}
				wAjax(profileParam, function(result) {
					var info = result.data.info;
					document.getElementById('user_name').innerHTML = info.mei_real_name;
					if(info.mei_head) {
						document.getElementById('head_image').src = info.mei_head;
					}
					if(info.mei_sex == 1) {
						document.getElementById('sex').innerHTML = '男';
					} else if(info.mei_sex == 2) {
						document.getElementById('sex').innerHTML = '女';
					}
					document.getElementById('birth').innerHTML = new Date(1000 * info.mei_birth).format("yyyy-MM-dd");

				})
			}
			
			document.getElementById('leixing').addEventListener('tap', function(){
				var actionstyle = {
								title: "	请选择你的性别",
								buttons: [{
									title: "男"
								}, {
									title: "女"
								}]
							};
							plus.nativeUI.actionSheet(actionstyle, function(e) {
								console.log("User pressed: " + e.index);
								if(e.index == 1){
									document.getElementById('sex').innerHTML = '男';
								} else if(e.index == 2){
									document.getElementById('sex').innerHTML = '女';
								}
							});
			})

			document.getElementById('birthday').addEventListener('tap', function() {
				var dtPicker = new mui.DtPicker({
					'type': 'date',
					'beginDate': new Date(1900, 01, 01),
				});
				//	dtPicker.setSelectedValue(new Date(1990,01,01))
				dtPicker.show(function(selectItems) {
					document.getElementById('birth').innerHTML = selectItems.text;
				})
			})

//			mui("#forward").on('tap', 'a', function(e) {
//				var sex = this.innerHTML;
//				document.getElementById('sex').innerHTML = sex;
//				mui('#forward').popover('hide');
//				//				cancelOrder(reason);
//			});

			//头像
			document.getElementById('zhaoxiang').addEventListener('tap', function() {
				if(mui.os.plus) {
					var a = [{
						title: "拍照"
					}, {
						title: "从手机相册选择"
					}];
					plus.nativeUI.actionSheet({
						/*title: "修改用户头像",*/
						cancel: "取消",
						buttons: a
					}, function(b) { /*actionSheet 按钮点击事件*/
						switch(b.index) {
							case 0:
								break;
							case 1:
								getImage(); /*拍照*/
								break;
							case 2:
								galleryImg(); /*打开相册*/
								break;
							default:
								break;
						}
					})
				}
			}, false);

			// 上传文件
			//			function upload(path) {
			////				if(files.length <= 0) {
			////					plus.nativeUI.alert("没有添加上传文件！");
			////					return;
			////				}
			////				outSet("开始上传：")
			//				var wt = plus.nativeUI.showWaiting();
			//				var task = plus.uploader.createUpload('https://365image.lanyukj.cn/index.php/Upload/jzUpload', {
			//						method: "POST"
			//					},
			//					function(t, status) { //上传完成
			//						if(status == 200) {
			////							outLine("上传成功：" + t.responseText);
			////							plus.storage.setItem("uploader", t.responseText);
			////							var w = plus.webview.create("uploader_ret.html", "uploader_ret.html", {
			////								scrollIndicator: 'none',
			////								scalable: false
			////							});
			////							w.addEventListener("loaded", function() {
			//								wt.close();
			////								w.show("slide-in-right", 300);
			////							}, false);
			//						} else {
			//							outLine("上传失败：" + status);
			//							wt.close();
			//						}
			//					}
			//				);
			//				task.addData("client", "HelloH5+");
			//				task.addData("uid", getUid());
			//				for(var i = 0; i < files.length; i++) {
			//					var f = files[i];
			//				task.addFile(path, null);
			//						key: f.name
			//					});
			//				}
			//				task.start();
			//			}
			//function cutImg(){  
			//   document.getElementById("showEdit").fadeIn();
			//  var $image = $('#report > img');
			//  $image.cropper({
			//    aspectRatio: 1 / 1,
			//    autoCropArea: 0.8
			//  });
			//}

			// 选择拍照
			function getImage() {
				var c = plus.camera.getCamera();
				c.captureImage(function(e) {
					plus.io.resolveLocalFileSystemURL(e, function(entry) {
						//						 document.getElementById("report").innerHTML = '<img src="'+entry.toLocalURL()+'">';
						//      cutImg();
						//      mui('#picture').popover('toggle');

						var s = entry.toLocalURL() + "?version=" + new Date().getTime();
						uploadHead(s); /*上传图片*/
					}, function(e) {
						console.log("读取拍照文件错误：" + e.message);
					});
				}, function(s) {
					console.log("error" + s);
				}, {
					filename: "_doc/head.png"
				})
			}

			// 本地相册选择 
			function galleryImg() {
				plus.gallery.pick(function(a) {
					plus.io.resolveLocalFileSystemURL(a, function(entry) {
						plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
							root.getFile("head.png", {}, function(file) {
								//文件已存在 
								file.remove(function() {
									entry.copyTo(root, 'head.png', function(e) {
											var e = e.fullPath + "?version=" + new Date().getTime();
											uploadHead(e); /*上传图片*/
											//变更大图预览的src 
											//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现 
										},
										function(e) {
											console.log('copy image fail:' + e.message);
										});
								}, function() {
									console.log("delete image fail:" + e.message);
								});
							}, function() {
								//文件不存在 
								entry.copyTo(root, 'head.png', function(e) {
										var path = e.fullPath + "?version=" + new Date().getTime();
										uploadHead(path); /*上传图片*/
									},
									function(e) {
										console.log('copy image fail:' + e.message);
									});
							});
						}, function(e) {
							console.log("get _www folder fail");
						})
					}, function(e) {
						console.log("读取拍照文件错误：" + e.message);
					});
				}, function(a) {}, {
					filter: "image"
				})
			};
			//上传图片 
			function uploadHead(imgPath) {
				head_image.src = imgPath;
				head_image.style.width = 80;
				head_image.style.height = 80;

				var image = new Image();
				image.src = imgPath;
				image.onload = function() {

					//		upload(imgPath);
					getBase64Image(image);
				};
			}

			//将图片压缩转成base64 
			function getBase64Image(img) {

				var expectWidth = 80;
				var expectHeight = 80;
				// 设定等待动画框，新页面加载完毕后再显示
				var nwaiting = plus.nativeUI.showWaiting();

				var canvas = document.createElement("canvas");
				setTimeout(function() {
					var ctx = canvas.getContext("2d");
					canvas.width = expectWidth;
					canvas.height = expectHeight;
					ctx.drawImage(img, 0, 0, expectWidth, expectHeight);

					var mpImg = new MegaPixImage(img);
					EXIF.getData(img, function() {
						EXIF.getAllTags(this);
						/**
						 * 图片的旋转方向信息
						 * 1、图片没有发生旋转
						 * 6、顺时针90°
						 * 8、逆时针90°
						 * 3、180° 旋转
						 */
						var Orientation = EXIF.getTag(this, 'Orientation');
						if(Orientation != "" && Orientation != null) {
							// 方向信息，canvas 显示形式，canvas 对象，that,宽度，高度
							mpImg.render(canvas, {
								maxWidth: 80,
								maxHeight: 80,
								quality: 1,
								orientation: Orientation
							});
						}
						var dataURL = canvas.toDataURL("image/png", 1);
						//			imgData_new = dataURL.replace("data:image/png;base64,", "");
						localStorage.setItem('HEAD_PHOTO', dataURL);
						//			var list = plus.webview.currentWebview().opener();
						//			mui.fire(list, "refresh", {
						//				HEAD_PHOTO: imgData_new
						//			});
						setTimeout(function() {
							// 加载完毕后关闭等待框，并展示页面
							plus.nativeUI.closeWaiting();
						}, 2000);
					});
				}, 1000);

			}
