var iconsCanvas = document.getElementById('icon_panel') ,
	drawCanvas = document.getElementById('draw_panel') ,
	iconsContext = iconsCanvas.getContext('2d') ,
	drawContext = drawCanvas.getContext('2d') ,
	iconRange = {	pen : {x:10 , y : 15 } ,
					line: {x:10 , y : 60 } ,
					rect: {x:10 , y : 105} ,
					round: {x:10 , y : 150 } ,
					text: {x:10 , y : 195 } ,
					eraser: {x:10 , y : 240 } ,
					strokeColor: {x:10 , y : 285 } ,
					fillColor: {x:10 , y : 330 } ,
					length : 8
				} ,
	ICON_LENGTH = 30 ,
	iconIndex = ['pen','line','rect','round','text','eraser','strokeColor','fillColor'] ,
	//global variable
	fillColor = "#0099cc" ,
	strokeColor = 'black' ,
	isMouseDown = false ,
	paintSourcePoint = {} , 
	mouseDownImageData ,
	//for icon refresh
	pointedActiveIcon = '' ,
	selectedActiveIcon = 'pen' ,
	//tool_bar
	lineWidthSelectLabel = document.createElement('label') ,
	lineWidthSelect = document.createElement('select') ,
	lineWidthValue = 0.5 , 
	alphaLabel = document.createElement('label') ,
	alphaText = document.createElement('input') ,
	alphaValue = 1.0 ,
	roundRectRadiusLabel = document.createElement('label') ,
	roundRectRadiusText = document.createElement('input') ,
	roundRectRadiusValue = 0 , 
	eraserRadiusLabel = document.createElement('label') ,
	eraserRadiusSelect = document.createElement('select') ,
	eraserRadiusValue = 30 ,
	toolbar = document.getElementById('toolbar') 
	;
	CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){
		
		if(Math.abs(w)/2 < r || Math.abs(h/2) < r || r < 0) return ; 
		this.beginPath() ;
		//drawPoint.call(this,x,y+h-r) ;
		//drawPoint.call(this,x,y) ;
		//this.arc(w,h,30,0,Math.PI*2,false) ;
		this.moveTo(x,y+h-r) ;
		this.arcTo(x,y,x+100,y,r) ;
		this.arcTo(x+w,y,x+w,y+r,r) ;
		this.arcTo(x+w,y+h,x+w-r,y+h,r) ;
		this.arcTo(x,y+h,x,y+h-r,r) ;
		this.stroke() ;
		console.log([x,y,w,h,r]) ;
		this.closePath() ;
	}
function drawIconBorder(range,shadowOffsetX,shadowOffsetY,shadowBlur){
	
	iconsContext.save() ;
	iconsContext.fillStyle = '#fff' ;
	iconsContext.strokeStyle = '#999' ;
	iconsContext.lineWidth = 0.8 ;
	iconsContext.shadowColor = '#666' ;
	iconsContext.shadowOffsetX = shadowOffsetX == undefined ? 1 : shadowOffsetX ;
	iconsContext.shadowOffsetY = shadowOffsetY == undefined ? 1 : shadowOffsetY ;
	iconsContext.shadowBlur = shadowBlur == undefined ? 1 : shadowBlur ;
	iconsContext.strokeRect(range.x,range.y,ICON_LENGTH,ICON_LENGTH) ;
	iconsContext.fillRect(range.x,range.y,ICON_LENGTH,ICON_LENGTH) ;
	iconsContext.restore() ;
}
/*
*start draw the icons inner
*
*/
//pen
function drawPen(isSelected){
	if(isSelected) drawIconBorder(iconRange['pen'],3,3,3) 
	else drawIconBorder(iconRange['pen'],1,1,1) ;
	var startPos = {} ;
	startPos.x = iconRange['pen'].x + 15 ;
	startPos.y = iconRange['pen'].y + 5 ;
	iconsContext.save() ;
	iconsContext.beginPath() ;
	iconsContext.moveTo(startPos.x,startPos.y) ;
	iconsContext.lineTo(startPos.x + 5, startPos.y + 2) ;
	iconsContext.lineTo(startPos.x , startPos.y + 17) ;
	iconsContext.lineTo(startPos.x - 4 , startPos.y + 20) ;
	iconsContext.lineTo(startPos.x -5 , startPos.y + 15) ;
	iconsContext.lineTo(startPos.x,startPos.y) ;
	iconsContext.moveTo(startPos.x , startPos.y + 16) ;
	iconsContext.lineTo(startPos.x -5 , startPos.y + 14) ;
	iconsContext.strokeStyle = '#0099cc' ;
	if(isSelected) iconsContext.lineWidth = 1.5 ;
	iconsContext.stroke() ;
	iconsContext.restore() ;
}
//line
function drawLine(isSelected){
	if(isSelected) drawIconBorder(iconRange['line'],3,3,3)
	else drawIconBorder(iconRange['line'],1,1,1) ;
	iconsContext.save() ;
	var startPos = {} ;
	startPos.x = iconRange['line'].x + 5 ;
	startPos.y = iconRange['line'].y + 5 ;
	iconsContext.beginPath() ;
	iconsContext.moveTo(startPos.x,startPos.y) ;
	iconsContext.lineTo(startPos.x + 20,startPos.y + 20) ;
	iconsContext.strokeStyle = '#0099cc' ;
	iconsContext.lineCap = 'round' ;
	iconsContext.lineWidth = isSelected ? 2 : 1.3;
	iconsContext.stroke() ;
	iconsContext.restore() ; 
}
//rect
function drawRect(isSelected){
	if(isSelected) drawIconBorder(iconRange['rect'],3,3,3) 
	else drawIconBorder(iconRange['rect'],1,1,1) ;
	var startPos = iconRange['rect'] ;
	iconsContext.save() ;
	iconsContext.strokeStyle = '#0099cc' ;
	iconsContext.lineWidth = isSelected ? 1.5 : 1 ;
	iconsContext.strokeRect(startPos.x +5 , startPos.y + 5, 20 , 20) ;
	iconsContext.restore() ;
}
//round
function drawRound(isSelected){
	if(isSelected) drawIconBorder(iconRange['round'],3,3,3)
	else drawIconBorder(iconRange['round'],1,1,1) ;
	var startPos = iconRange['round'] ;
	iconsContext.save() ;
	iconsContext.beginPath() ;
	iconsContext.arc(startPos.x + 15, startPos.y + 15 ,11, 0 , Math.PI* 2 , false) ;
	if(isSelected) iconsContext.lineWidth = 1.5 ;
	iconsContext.strokeStyle = '#0099cc' ;
	iconsContext.stroke() ;
	iconsContext.restore() ; 
}
//text
function drawText(isSelected){
	if(isSelected) drawIconBorder(iconRange['text'],3,3,3)
	else drawIconBorder(iconRange['text'],1,1,1) ;
	var startPos = iconRange['text'] ;
	iconsContext.save() ;
	iconsContext.beginPath() ;
	iconsContext.font = '26px arial' ;
	iconsContext.fillStyle = '#0099cc' ;
	iconsContext.fillText("T",startPos.x + 7 , startPos.y+ 25) ;
	if(isSelected) {
		iconsContext.strokeStyle = '#0099cc' ; 	
		iconsContext.strokeText("T",startPos.x + 7 , startPos.y+ 25) ;
	}
	iconsContext.restore() ;
}
//eraser
function drawEraser(isSelected){
	if(isSelected) drawIconBorder(iconRange['eraser'],3,3,3)
	else drawIconBorder(iconRange['eraser'],1,1,1) ;
	var startPos = {} ;
	startPos.x = iconRange['eraser']. x + 15 ;
	startPos.y = iconRange['eraser'].y + 15 ; 
	iconsContext.save() ;
	iconsContext.beginPath() ;
	iconsContext.strokeStyle = '#0099cc' ;
	if(isSelected) iconsContext.lineWidth = 1.5 ;
	iconsContext.translate(startPos.x ,startPos.y) ;
	iconsContext.rotate(Math.PI /4) ;
	iconsContext.strokeRect(-6,-10, 12,15) ;
	iconsContext.arc(0,5,6,0,Math.PI,false) ;
	iconsContext.stroke() ;
	iconsContext.restore() ;
}
//strokeColor
function drawStrokeColor(){
	drawIconBorder(iconRange['strokeColor'],1,1,1) ;
	iconsContext.save() ;
	iconsContext.fillStyle = strokeColor === '' ? "black" : strokeColor ;
	iconsContext.fillRect(iconRange['strokeColor'].x + 5 , iconRange['strokeColor'].y+5,20,20) ; 
	iconsContext.restore() ;
}
function drawFillColor(){
	drawIconBorder(iconRange['fillColor'],1,1,1) ;
	iconsContext.save() ;
	iconsContext.fillStyle = fillColor === '' ? '#0099cc' : fillColor ;
	iconsContext.fillRect(iconRange['fillColor'].x+5,iconRange['fillColor'].y+5,20,20) ;
	iconsContext.restore() ;
}


function fixEvent(e){
	if(e.target) return e ;
	 var event = {} ;
	 event.target = e.srcElement || document ;
	 event.preventDefault = function(){
	 	e.returnValue = false ;
	 } 
	 event.stopPropagation = function(){
	 	e.cancelBubble = true ;
	 }
	 for(name in e){
	 	event[name] = e[name] ;
	 }
	 return event ;
}

function getEvent(e){
	return fixEvent(e||window.event) ;
}

function bind(type,elm,fn){
	elm = typeof elm === 'string' ? document.getElementById(elm) : elm ;
	if(document.addEventListener){
		elm.addEventListener(type,fn,false) ;
	}
	else{
		elm.attachEvent('on'+type,fn) ;
	}
}
function getScrollPos(){
	return {
			scrollTop : document.documentElement.scrollTop || document.body['scrollTop'],
			scrollLeft : document.documentElement.scrollLeft || document.body['scrollLeft']
	} ;
}
/*
*直接设置event属性
*
*/
function getCanvasPosition(elm,event){
	elm = typeof elm === 'string' ? document.getElementById(elm) : elm ;
	var posInfo = elm.getBoundingClientRect() ,
		elmX = posInfo.left ,
		elmY = posInfo.top ;
	var relativeX = event.clientX - elmX ,
		relativeY = event.clientY - elmY ;
	//
	//console.log([relativeX,relativeY].join(':')) ;

	var canvasSurfaceX = relativeX * (elm.width / posInfo.width) ,
		canvasSurfaceY = relativeY * (elm.height / posInfo.height) ;
	//console.log([canvasSurfaceX,canvasSurfaceY].join(':')) ;
	event.canvasX = canvasSurfaceX ;
	event.canvasY = canvasSurfaceY ;
	return {
			canvasX : canvasSurfaceX ,
			canvasY : canvasSurfaceY
	} ;
}
function getActiveIcon(pos){
	if(pos.canvasY  <= 0 || pos.canvasY > iconRange.length * 45) return ;
	else if(pos.canvasX <10 || pos.canvasX > 40) return ;
	else{
		var aboutIndex = Math.ceil(pos.canvasY / 45) -1 ,
		obj = iconIndex[aboutIndex] ;
		if(pos.canvasY < iconRange[obj].y) return ;
		else return obj ;
	}
}
function capitalize(str){
	var firstChar = str.charAt(0) ;
	return firstChar.toUpperCase() + str.replace(firstChar,'') ;
}
/*
*how to refresh , we just refresh the part need to be refreshed
*we need to remember the actived icon ,including the selected and pointed
*eventType : mousemove
*	if pointedIcon == undefined then if pointedActiveIcon != '' ,should rePaint it ,clear the pointedActiveIcon
*		and paint it  ;
*	if pointedIcon != undefined then if pointedIcon == SelectedActiveIcon ,do nothing ,else if not ,shoud repaint
*	the pointedIcon and change the value of pointedActiveIcon ;if necessary ,we may need repaint the previous 
*	pointedActiveIcon
*eventType : click
	if  pointedIcon == undefined ,do nothing ,else if the pointedIcon == selectedActiveIcon , do nothing ,else 
		repaint the selectedActiveIcon (because the pointedIcon must have been repainted) ,and change the pointedActiveIcon
		 = ''
that is : we can't let the pointedActiveIcon equals the selectedActiveIcon , it's just to reduce the paint reflict 
*/ 
function refreshIcon(pointedIcon,eventType){
	if(eventType === 'click'){
		if(pointedIcon == undefined ) return ;
		else{
			if(pointedIcon == selectedActiveIcon)  return ;
			else{
				//clear the selectedActiveIcon
				iconsContext.clearRect(0,iconRange[selectedActiveIcon].y -10,iconsCanvas.width,40+5) ;
				window['draw'+capitalize(selectedActiveIcon)](false) ;
				selectedActiveIcon = pointedIcon ; 
			}
		}
	}
	else
	{
		if(pointedIcon == undefined){
			//repaint the pointedActiveIcon
			if(pointedActiveIcon === '') return ;
			else if(pointedActiveIcon === selectedActiveIcon) pointedActiveIcon = '' ;
			else{
				iconsContext.clearRect(0,iconRange[pointedActiveIcon].y -10,iconsCanvas.width,40+5) ;
				window['draw'+capitalize(pointedActiveIcon)](false) ;
				//change the pointedActiveIcon !!
				pointedActiveIcon = '' ;
			}
		}
		else{
			//is the pointedIcon is the activeIcon
			if(pointedIcon == pointedActiveIcon || pointedIcon == selectedActiveIcon) return ;
			else{
				//active the icon 
				iconsContext.clearRect(0,iconRange[pointedIcon].y -10 ,iconsCanvas.width,40+5) ;
				window['draw'+capitalize(pointedIcon)](true) ;
				if(pointedActiveIcon !== ''){
					iconsContext.clearRect(0,iconRange[pointedActiveIcon].y -10,iconsCanvas.width,40+5) ;
					window['draw'+capitalize(pointedActiveIcon)](false) ;
				}
				pointedActiveIcon = pointedIcon ;
			}
		}
	}
}
function toolbarInit(){
	lineWidthSelectLabel.innerHTML = '线宽:' ;
	lineWidthSelectLabel.setAttribute('id','lineWidthSelectLabel') ;
	var option_value = [0.5,1,2.5,3,5,10] ;
	for(var i = 0 ; i < option_value.length ; i++){
		var option = document.createElement('option') ;
		option.setAttribute('value',option_value[i]) ;
		option.innerHTML = option_value[i]+'像素' ;
		lineWidthSelect.appendChild(option) ;
	}
	lineWidthSelect.setAttribute('id','lineWidth') ;
	//alpha
	alphaLabel.innerHTML = '透明度:' ;
	alphaLabel.setAttribute('id','alphaLable') ;
	alphaText.type = 'text' ;
	alphaText.style.width = '40px' ;
	alphaText.setAttribute('id','alphaText') ;
	alphaText.value = '1.0' ;
	//roundRectRadius
	roundRectRadiusLabel.innerHTML = '圆角半径：' ;
	roundRectRadiusLabel.setAttribute('id','roundRectRadiusLabel') ;
	roundRectRadiusText.type = 'text' ;
	roundRectRadiusText.setAttribute('id','roundRectRadiusText') ;
	roundRectRadiusText.value = roundRectRadiusValue ;
	//eraserRadius
	eraserRadiusLabel.innerHTML = '大小:' ;
	eraserRadiusLabel.setAttribute('id','eraserRadiusLabel') ;
	var eraserRadius = [5,30,50,80] ;
	var eraserRadiusOptions = eraserRadius.map(function(item){
		var option = document.createElement('option') ;
		option.setAttribute('value',item) ;
		option.innerHTML = item+'px' ;
		return option ;
	}) ;
	eraserRadiusOptions.forEach(function(item){
		eraserRadiusSelect.appendChild(item) ;
	}) ;
	eraserRadiusSelect.value = eraserRadiusValue.toString() ; ;
	bind('change',lineWidthSelect,function(e){
		lineWidthValue = this.value ;
		console.log('now the lineWidth is'+lineWidthValue) ;
	}) ;
	//avoid the invalid value , but can't ensure the value is valid ,such as 0. ,1.
	bind('keyup',alphaText,function(e){
		var numRange = /(^0\.[0-9]$)|(^0\.?$)|(^1\.0$)|^1\.?$/ ;
		if(!numRange.test(alphaText.value)) alphaText.value = alphaText.value.slice(0,-1) ;
	}) ;
	bind('blur',alphaText,function(){
		var numRange = / (^0$)|(^0\.[0-9]$)|^1.0$/; 
		if(!numRange.test(alphaText.value)) alphaText.value = '1.0' ;
		alphaValue = alphaText.value ;
	}) ;
	bind('keyup',roundRectRadiusText,function(){
		var validRange = /^\d+$/ ;
		if(!validRange.test(roundRectRadiusText.value)) roundRectRadiusText.value = this.value.slice(0,-1) ;
	}) ;
	bind('blur',roundRectRadiusText,function(){
		roundRectRadiusValue = this.value ;
	}) ;
	bind('change',eraserRadiusSelect,function(){
		eraserRadiusValue = this.value ;
		
	}) ;
}
function toolbarHandle(){
	//toolbar.innerHTML = '' ; !! IE 会将子元素也清空！！！
	for(var i = toolbar.childNodes.length ; i > 0 ; i--){
		toolbar.removeChild(toolbar.childNodes[i-1]) ;
	}
	switch(selectedActiveIcon){
		case 'pen' :
		case 'line':
		case 'round':{
			toolbar.appendChild(lineWidthSelectLabel);
			toolbar.appendChild(lineWidthSelect);
			toolbar.appendChild(alphaLabel) ;
			toolbar.appendChild(alphaText) ;
			break ;
		}
		case 'rect' :{
			toolbar.appendChild(lineWidthSelectLabel);
			toolbar.appendChild(lineWidthSelect);
			toolbar.appendChild(alphaLabel) ;
			toolbar.appendChild(alphaText) ;
			toolbar.appendChild(roundRectRadiusLabel) ;
			toolbar.appendChild(roundRectRadiusText) ;
			break ;
		}
		case 'eraser' :{
			toolbar.appendChild(eraserRadiusLabel) ;
			toolbar.appendChild(eraserRadiusSelect) ;
		}
		default:
	} ;
}
function setContext(){
	drawContext.lineWidth = lineWidthValue ;
	drawContext.strokeColor = strokeColor ;
	drawContext.globalAlpha = alphaValue ;
}
bind('mousemove',iconsCanvas,function(e){
	var event = fixEvent(e) ;
	var clientPos = getCanvasPosition(iconsCanvas,event) ,
		pointedIcon = getActiveIcon(clientPos) ;
	refreshIcon(pointedIcon,'mousemove') ;
	//change the pointer
	iconsCanvas.style.cursor = typeof pointedIcon === 'undefined' ? 'default' : 'pointer' ;
	event.preventDefault() ;
}) ;

bind('click',iconsCanvas,function(e){
	var event = fixEvent(e) ;
	var clientPos = getCanvasPosition(iconsCanvas,event) ,
		pointedIcon = getActiveIcon(clientPos) ;
	refreshIcon(pointedIcon,'click') ;
	if(pointedIcon != undefined) toolbarHandle() ;
	event.preventDefault() ;
}) ;

bind('mousedown',drawCanvas,function(e){
	var event = getEvent(e) ;
		paintSourcePoint.canvasX = getCanvasPosition(this,event).canvasX ;
		paintSourcePoint.canvasY = getCanvasPosition(this,event).canvasY ;
	isMouseDown = true ;
	drawContext.save() ;
	setContext() ;
	switch(selectedActiveIcon){
		case 'eraser':{
			drawContext.beginPath() ;
			drawContext.putImageData(mouseDownImageData,0,0) ;
			drawContext.arc(event.canvasX,event.canvasY,eraserRadiusValue,0,Math.PI*2 ,false) ;
			drawContext.stroke() ;
			//console.log(['down',event.canvasX, event.canvasY]) ;
			break ;
		}
	}
	drawContext.restore() ;
	event.preventDefault() ;//!!使用这个后焦点转移都不能完成，使得alpha值不能获取;但不用后触发的默认事件太多
	alphaText.blur() ; //blur by hand 
	event.stopPropagation() ;
}) ;
bind('mousemove',drawCanvas,function(e){
	//for some tools ,such as eraser ,we need to draw the tool regardless wheather the mouse is pressed down
	var event = getEvent(e) ;
	getCanvasPosition(this,event) ;
	drawContext.save() ;
	setContext() ;
	if(!isMouseDown){
		if(mouseDownImageData === undefined) {
			mouseDownImageData = drawContext.getImageData(0,0,this.width , this.height) ;
		}
		switch(selectedActiveIcon) {
			case 'eraser' :{
					drawContext.putImageData(mouseDownImageData,0,0) ;
					drawContext.beginPath() ;
					drawContext.arc(event.canvasX , event.canvasY , eraserRadiusValue , 0, Math.PI*2 , false) ;
					drawContext.stroke() ;
					//console.log(['move',event.canvasX, event.canvasY]) ;
					break ;
			}
		}
	}
	else{
	//console.log([lineWidthValue,strokeColor,alphaValue].join(',')) ;
		switch(selectedActiveIcon){
			case 'pen' :{
					drawContext.beginPath() ;
					drawContext.moveTo(paintSourcePoint.canvasX,paintSourcePoint.canvasY) ;
					drawContext.lineTo(event.canvasX,event.canvasY) ;
					drawContext.lineCap = 'round' ;
					drawContext.stroke() ;
					drawContext.closePath() ;
					paintSourcePoint.canvasX = event.canvasX ;
					paintSourcePoint.canvasY = event.canvasY ; 
				break ;
			}
			case 'line' :{
					drawContext.putImageData(mouseDownImageData,0,0) ;
					drawContext.beginPath() ;
					drawContext.moveTo(paintSourcePoint.canvasX,paintSourcePoint.canvasY) ;
					drawContext.lineTo(event.canvasX , event.canvasY) ;
					drawContext.stroke() ;
					drawContext.closePath() ;
				break ;
			}
			case 'rect' :{
					drawContext.putImageData(mouseDownImageData,0,0) ;
					drawContext.beginPath() ;
					drawContext.moveTo(paintSourcePoint.canvasX,event.canvasY - roundRectRadiusValue) ;
					drawContext.roundRect(paintSourcePoint.canvasX,paintSourcePoint.canvasY,event.canvasX - paintSourcePoint.canvasX ,
						event.canvasY - paintSourcePoint.canvasY , roundRectRadiusValue) ;
				break ;

			}
			case 'round' :{
					var roundCenter = {} ,
						radius ,
						x1 = paintSourcePoint.canvasX , 
						y1 = paintSourcePoint.canvasY ,
						x2 = event.canvasX ,
						y2 = event.canvasY ; 
					roundCenter.x = (paintSourcePoint.canvasX + event.canvasX) /2 ; 
					roundCenter.y = (paintSourcePoint.canvasY + event.canvasY) /2 ;
					radius = Math.sqrt( Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2))/2 ;
					drawContext.putImageData(mouseDownImageData,0,0) ;
					drawContext.beginPath() ;
					drawContext.arc(roundCenter.x , roundCenter.y , radius,0 ,Math.PI*2 ,false ) ;
					drawContext.stroke() ;
					drawContext.closePath() ;
				break ;
			}
			case 'eraser':{
					//clip
					drawContext.beginPath() ;
					drawContext.putImageData(mouseDownImageData,0,0) ;
					drawContext.arc(event.canvasX , event.canvasY , eraserRadiusValue , 0 , Math.PI*2 , false) ;
					drawContext.clip() ;
					drawContext.clearRect(0,0,this.width , this.height) ; 
					mouseDownImageData = drawContext.getImageData(0,0,this.width,this.height) ;
					drawContext.stroke() ;
					//console.log(['down_move',event.canvasX, event.canvasY]) ;
					//alert() ;
			}
			
		}
	}
	drawContext.restore() ;
}) ;
bind('mouseup',drawCanvas,function(e){
	var event = getEvent(e) ;
	getCanvasPosition(drawCanvas,event) ;
	isMouseDown = false ;
	drawContext.save() ; 
	switch(selectedActiveIcon){
		case 'pen':
		case 'line':
		case 'round':
		case 'rect' :{
			mouseDownImageData = drawContext.getImageData(0,0,this.width ,this.height) ;
			break ;
		}
		case 'eraser' :{
			drawContext.beginPath() ;
			drawContext.putImageData(mouseDownImageData,0,0) ;
			drawContext.arc(event.canvasX , event.canvasY , eraserRadiusValue, 0 ,Math.PI * 2 , false ) ;
			drawContext.clip() ;
			drawContext.clearRect(0,0,this.width, this.height) ;
			mouseDownImageData = drawContext.getImageData(0,0,this.width, this.height) ;
			drawContext.stroke() ;
			//console.log(['up',event.canvasX,event.canvasY]) ;
			break ; 
		}
	}
	drawContext.restore() ;
}) ;
bind('mouseout',drawCanvas,function(e){
	drawContext.putImageData(mouseDownImageData,0,0) ;
	/*
	var event = getEvent(e) ;
	var newEvent = document.createEvent('MouseEvents') ;
	newEvent.initMouseEvent('mouseup',true,true,document.defaultView,0,event.screenX,event.screenY,event.clientX,event.clientY,false,false,false,false,0,event.relatedTarget) ;
	this.dispatchEvent(newEvent) ;
	console.log('mouseOut') ;
	*/
}) ;

function drawIcons(){
	drawPen(true) ;
	drawLine(false) ;
	drawRect(false) ;
	drawRound(false) ;
	drawText(false) ;
	drawEraser(false) ;
	drawStrokeColor() ;
	drawFillColor() ;
	
} ;

(function paint(){
	drawIcons() ;
	toolbarInit() ;
	toolbarHandle() ;
})() ;
