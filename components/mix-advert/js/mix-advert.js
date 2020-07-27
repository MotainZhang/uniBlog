
let advertView = null;
let advertTxt = null;
let advertInterval = null;

//背景
function drawBg(imageUrl, url){
	let viewStyles = {
		top: '0px',
		left: '0px',
		backgroundColor:'#333333',
		height: '100%',
		width: '100%',
	}
	advertView = new plus.nativeObj.View('advert', viewStyles);
	let advertBg = {
		tag: 'img',
		id: 'adverBg',
		src: imageUrl,
		position:{
			top: '0px',
			left: '0px',
			width: '100%',
			height: '100%',
		},
	}
	advertView.draw([advertBg]);
	advertView.show();
	advertView.addEventListener("click", function(){
		uni.navigateTo({
			url: url
		})
		hideAdvert();
	}, false);
}

//跳过按钮
function drawSkipBtn(timer){
	let h = uni.getSystemInfoSync().statusBarHeight || 34
	let w = uni.getSystemInfoSync().windowWidth;
	let viewStyles = {
		top: h+10+'px',
		left: (w - uni.upx2px(170)) + 'px',
		height: '28px',
		width: '68px'
	}
	advertTxt = new plus.nativeObj.View('adverts', viewStyles);
	let advertTextWrapper = {
		tag: 'rect',
		id: 'rect',
		rectStyles:{
			color: 'rgba(0,0,0,0.4)',
			radius: '14px'
		},
		position:{
			top: 0,
			left: 0,
			width: '68px',
			height: '28px'
		}
	}
	let advertText = {
		tag: 'font',
		id: 'adverText',
		text: '跳过',
		position:{
			top:0+'px',
			left: 0 + 'px',
			width: '68px',
			height: '28px',
			zIndex:'11'
		},
		textStyles:{
			size:'15px',
			color:'#fff',
		},
	} 
	advertText.text = `跳过 ${timer}`;
	advertTxt.draw([advertTextWrapper,advertText]);
	advertTxt.show()
	
	//倒计时
	advertInterval = setInterval(()=>{
		timer --;
		if(timer < 1){
			hideAdvert();
			return;
		}
		advertText.text = `跳过 ${timer}`;
		advertTxt.draw([advertText,advertTextWrapper]);
	}, 1000)
	
	advertTxt.addEventListener('click', ()=>{
		hideAdvert();
	},false)
}

function hideAdvert(){
	advertInterval && clearInterval(advertInterval);
	advertInterval = null;
	// advertView.hide();
	advertView.close();
	advertTxt.close()
}

function initAdvert(params){
	let {timer, url, imageUrl} = params;
	timer = timer || 4;
	
	drawBg(imageUrl, url);
	drawSkipBtn(timer);
}


export default{
	initAdvert
}