        var typeList = [],
            city_id = '';

        mui("#mui-template").on('tap', 'img', function (e) {
            //				plus.nativeUI.showWaiting("正在加载...", {
            //					background: "white", 
            //					width: '150px', 
            //					height: '150px',
            //					padding: '50px'
            //				});
			// mui("#mui-template2")[0].innerHTML = '';
			var str = template('temp2', {
				'record': []
			});
			mui("#mui-template2")[0].innerHTML = str;
            var wt = plus.nativeUI.showWaiting('正在加载...', {
                width: '40%',
                height: '20%',
                padding: '10%',
                background: "rgba(255,255,255,0)",
                style: 'black',
                color: "rgba(0,0,0,1)"
            })
            var id = this.getAttribute("id");
            var imgList = document.querySelectorAll(".img-center");
            if (imgList) {
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i].setAttribute('class', 'img-center img-gray');
                }
            }
            this.setAttribute('class', 'img-center');
            for (var i = 0; i < typeList.length; i++) {
                if (typeList[i].si_id == id) {
                    getAd(typeList[i].si_id);
                    document.getElementById('firstTypeName').innerHTML = typeList[i].si_name;
                }
            }
            // setTimeout(function () {
                getSecondTypeList(id);
            // }, 100)

        });

        mui("#mui-template2").on('tap', 'button', function (e) {
			
            var id = this.getAttribute("id");
            var first_id = this.getAttribute('name');
            var name = this.getAttribute('sname');
            mui.openWindow({
                url: 'service_list.html',
                id: 'service_list.html',
                extras: {
                    type_id: id,
                    first_id: first_id,
                    name: name
                },
                show: {
                    autoShow: false, //页面loaded事件发生后自动显示，默认为true
                    event: 'loaded' //页面显示时机，默认为titleUpdate事件时显示
                }
            });
        });

        window.addEventListener('changeCity', function (event) {
            if (event) {
                //					var provinceCode = event.detail.provinceCode; //省id
                //					var provinceName = event.detail.provinceName; //省名称
                city_id = event.detail.cityCode; //市id
                //					var cityName = event.detail.cityName; //市名称
                //					var areaCode = event.detail.areaCode; //区id
                //					var areaName = event.detail.areaName; //区名称

                //					city_id = cityCode;
            }

        });

        window.addEventListener('toService', function (event) {
            if (event) {
                for (var i = 0; i < typeList.length; i++) {
                    if (typeList[i].si_id == event.detail.service_id) {
                        mui.trigger(document.getElementById(event.detail.service_id), 'tap');
                    }
                }
            }

        });

        mui.plusReady(function () {
            var typeListParam = {
                service: 'Hlbr365app.Goods.GetOneList'
            };

            wAjax(typeListParam, function (result) {
                typeList = result.data.info;
                var str = template('temp', {
                    'record': typeList
                });
                document.getElementById("mui-template").innerHTML = str;
                mui.trigger(document.querySelector('.img-center'), 'tap');
            });
        })

        function getSecondTypeList(firtTypeId) {
            var secTypeListParam = {
                service: 'Hlbr365app.Goods.GetTwoListByOne',
                si_id: firtTypeId
            }
            wAjax(secTypeListParam, function (result) {
                var sceTypeList = result.data.info.service;
                var str = template('temp2', {
                    'record': sceTypeList
                });
                document.getElementById("mui-template2").innerHTML = str;
                plus.nativeUI.closeWaiting();
            })
        }

        function getAd(serviceType) {
            var adParam = {
                service: 'Hlbr365app.Ad.GetList',
                ap_id: 2,
                ar_wid: serviceType,
                ar_city_id: city_id
            };
            wAjax(adParam, function (result) {
                var adList = result.data.list;
                if (adList.ar_img) {
                    document.getElementById('firstTypeIcon').src = adList.ar_img;
                }

                //						var str = template('temp', {
                //							"record": adList
                //						});
                //						document.getElementById("mui-template").innerHTML = str;
            });
        }

        //			function getGoodsList(typeID) {
        //				var goodsListWithInfo = [];
        //				var goodsParam = {
        //					service: 'Hlbr365app.Goods.GetServiceList',
        //					two_type_id: typeID,
        //					city_id: city_id,
        //					firstRow: 1,
        //					listRows: 20
        //				}
        //				wAjax(goodsParam, function(result) {
        //					var goodsList = result.data.list;
        //					for(var i = 0; i < goodsList.length; i++) {
        //						var goodsWithInfo = getGoodsInfo(goodsList[i].jg_id) || {};
        //						goodsListWithInfo.push(goodsWithInfo);
        //					}
        //
        //					var str = template('temp', {
        //						'record': goodsListWithInfo
        //					});
        //					document.getElementById("mui-template").innerHTML = str;
        //
        //				})
        //			}
        //
        //			function getGoodsInfo(goodsId) {
        //				var infoParam = {
        //					service: 'Hlbr365app.Goods.GetGoodsInfo',
        //					jg_id: goodsId
        //				}
        //				wAjax(infoParam, function(result) {
        //					var goodsInfo = result.data.info;
        //					return goodsInfo;
        //				})
        //			}
