mui.plusReady(function() {
	var topoffset=tiaozhengTOP();
});
function tiaozhengTOP(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	var iszhichi = plus.navigator.isImmersedStatusbar();
	var topoffset;
	if(iszhichi) {
		topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 35) + 'px';
		document.querySelector("header").style.height=topoffset;
		document.querySelector("header").style.paddingTop="20px";
		document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop=topoffset;
	}
	else{
		topoffset=45+'px';
		document.querySelector("header").style.height=topoffset;
	}
	return topoffset;
}
