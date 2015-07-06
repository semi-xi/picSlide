define('carousel',function(require, exports, module){
	var $ = require("$-debug");

	function Carousel(ops){
		this.config={
			element : "[data-role='carousel']",
			triggers : "[data-switchable-role='nav']",
			content : "[data-switchable-role='content']",
			prevBtn : "[data-switchable-role='prev']",
			nextBtn : "[data-switchable-role='next']",
			disableClass : "carousel-disBtn",
			activeIndex : 0 ,
			prevIndex : 0,
			nextIndex : 0,
			direction: 'scrollX',
			circular:false,
			autoplay:false,
			duration: 300,
			moveDis:0,
			steps:2,
			autoplay:false,
			autoplayTime:2000,
			showWH:0,
			_timer:null,
			_screenShowLen:0
		}
		this.config=this._extend(ops);
		this._init();
	}
	Carousel.prototype._init=function(){
		this.config.length=$(this.config.element).find(this.config.content).children().length;
		this.config.activeIndex=0;
		this._setMoveDis();
		this._initContent();
		this._bindTrigger();
		this._setAutoPlay();
		this._resize();
	}
	Carousel.prototype._initContent=function(){
		var direction=this._moveDirection();
		var dur=this.get('duration','attr');
		if(this._isSupportCss3()){
			this.get(this.config.content,'ele').css({
				'position': 'relative',
				'transform: ' : 'translate(0,0)',
				'webkitTransform':'translate(0,0)',
				'MozTransform':'translate(0,0)',
				'msTransform':'translate(0,0)',
				'transition':'transform ease-in '+ dur/1000 + 's',
				'webkitTransition':'-webkit-transform ease-in '+ dur/1000 + 's',
				'MozTransition':'-moz-transform ease-in '+ dur/1000 + 's',
				'msTransition':'-ms-transform ease-in '+ dur/1000 + 's'
			})
		} else{
			this.get(this.config.content,'ele').css({
				'position': 'relative',
				'left' : 0,
				'top' : 0
			})
		}

	}
	Carousel.prototype._extend=function(ops){
		return $.extend(this.config,ops);
	}
	Carousel.prototype._setMoveDis=function(){
		//找到最多能走几次  以及 最后一步走多少
		var _this=this;
		// var showWH=this.config.showWH
		this.config.moveDis=this._getMoveDis(this.config.direction); //确定每一步走多少，以及方向 li的高度或者宽度
		var direction=this._moveDirection();
		var showLen=1 / this.get('steps','attr');//一屏显示多少个内容
		var disLen=0;

		switch(direction){
			case 'left' :
				this.config.showWH=$(this.config.element).width(); //显示的高度
				showLen=this.config.showWH / this.config.moveDis;
				disLen=parseInt(showLen) - showLen //判断是不是整数 向上取整

				this.config.maxMoveSteps=Math.ceil(Math.ceil((this.get('length','attr')  - ($(this.config.element).width() / this.config.moveDis))) / this.get('steps','attr')); //最多能走多少步  总个数 - 显示的多少个
				break;
			case 'top' :
				this.config.showWH=$(this.config.element).height(); //显示的高度
				showLen=this.config.showWH / this.config.moveDis;
				disLen=parseInt(showLen) - showLen //判断是不是整数 向上取整
				this.config.maxMoveSteps=Math.ceil(Math.ceil((this.get('length','attr') - ($(this.config.element).height() / this.config.moveDis))) / this.get('steps','attr')); //最多能走多少步
				break;
		}

		this.config._screenShowLen= Math.ceil(this.config.showWH / (this.config.moveDis * this.get('steps','attr')));

		switch(disLen == 0){ //判断是不是整数
			case true : //整数的话最后一步不需要走
				this.config.excessDis=0;
				break;
			case false :  //非整数的话应该需要走多一步完成剩下的距离
				this.config.excessDis =  this.get('_screenShowLen','attr') * this.get('moveDis','attr') * this.get('steps','attr') - this.config.showWH;
				break;
		}

	}
	Carousel.prototype.get=function(str,ops){
		if(ops=='attr'){
			return this.config[str];
		} else{
			if(ops='ele'){
				return $(this.config.element).find(str).eq(0);
			}
		}

	}
	Carousel.prototype.set=function(attr,val){
		this.config[attr]=val;
		return this;
	}
	Carousel.prototype._getMoveDis=function(direction){
		var child=this.get(this.config.content,'ele').children(0);
		switch(direction){
			case 'scrollX' :
				return child.outerWidth() + parseInt(child.css('marginLeft')) + parseInt(child.css('marginRight'));break;

			case 'scrollY' :
				return child.outerHeight() + parseInt(child.css('marginTop')) + parseInt(child.css('marginBottom'));break;

		}
	}
	Carousel.prototype.switchTo=function(fromIndex,toIndex){
		console.log(fromIndex,toIndex)
		if(fromIndex==toIndex) return;
		var child=this.get(this.config.content,'ele').children(0);
		this._upDateDisBtn();
		var contentBox=this.get(this.config.content,'ele');
		var dis=this.get('moveDis','attr');

		var val=0;
		var moveVal={};
		switch(this._moveDirection()){
			case 'top':
				if(toIndex == (this.config.maxMoveSteps ) || toIndex == 0){
					// console.log('最后一次了')
					//距离 * 移动的距离 + 最后一次需要移动的距离 * 方向
					//方向是用自己/绝对值自己
					// val=(dis * ( fromIndex -  toIndex) * this.get('steps','attr') + this.config.excessDis * (( fromIndex -  toIndex)/Math.abs(( fromIndex -  toIndex))));


					val=this.config.excessDis * (( fromIndex -  toIndex)/Math.abs(( fromIndex -  toIndex)))
					if(val < 0) val= val + parseInt(child.css('marginBottom')); //最后一次的时候，当如果小于0的时候 往左走 应该把右边距忽略掉，这样可以让右边永远跟盒子的右边贴边 本身每次走的时候都会加上自己的边距
					if(val >= 0) val= val - parseInt(child.css('marginBottom'))

				} else{
					val=dis * ( fromIndex -  toIndex) *  this.get('steps','attr')
				};
				moveVal.top=this._transformVal()[1] - 0 + val;
				if(this._isSupportCss3()){

					this._css3Move('top',moveVal)
				} else{
					this._css2Move('top',moveVal)
				}
				break;
			case 'left':
				if(toIndex == (this.config.maxMoveSteps ) || toIndex == 0){
					// console.log('最后一次了')
					//距离 * 移动的距离 + 最后一次需要移动的距离 * 方向
					//方向是用自己/绝对值自己
					// val=(dis * ( fromIndex -  toIndex) * this.get('steps','attr') + this.config.excessDis * (( fromIndex -  toIndex)/Math.abs(( fromIndex -  toIndex))));
					val=this.config.excessDis * (( fromIndex -  toIndex)/Math.abs(( fromIndex -  toIndex)));

					if(val < 0) val= val + parseInt(child.css('marginRight')); //最后一次的时候，当如果小于0的时候 往左走 应该把右边距忽略掉，这样可以让右边永远跟盒子的右边贴边 本身每次走的时候都会加上自己的边距
					if(val >= 0) val= val - parseInt(child.css('marginLeft'));
					// console.log(333)
					moveVal.left=this._transformVal()[0] - 0 + val;
					console.log('结束')
				} else{
					val=dis * ( fromIndex -  toIndex) * this.get('steps','attr');
					moveVal.left=this._transformVal()[0] - 0 + val;
				};

				console.log(this._transformVal()[0] - 0 , val , moveVal.left)
				if(this._isSupportCss3()){
					this._css3Move('left',moveVal)
				} else{
					this._css2Move('left',moveVal)
				}
				break;
		}
		$(this.config.element).attr({
			activeIndex: toIndex
		})
	}
	Carousel.prototype._bindTrigger=function(){
		var _this=this;
		var prevBtn=this.get(this.config.prevBtn,'ele');
		var nextBtn=this.get(this.config.nextBtn,'ele');

		var len=this.get('maxMoveSteps','attr');
		var circular=this.get('circular','attr');
		prevBtn.on('click',function(){
			var nowIndex=_this.get('activeIndex','attr');
			if(!circular){
				//不循环的情况
				_this.set('prevIndex',nowIndex);
				nowIndex=nowIndex - 1;
				nowIndex <  0 ? _this.set('activeIndex',0) : _this.set('activeIndex',nowIndex)
				_this.switchTo(_this.get('prevIndex','attr') ,_this.get('activeIndex','attr'));
			}
		})
		nextBtn.on('click',function(){
			var nowIndex=_this.get('activeIndex','attr');

			if(!circular){
				_this.set('prevIndex',nowIndex);
				nowIndex=nowIndex + 1;
				nowIndex > (len ) ? _this.set('activeIndex',len ) : _this.set('activeIndex', nowIndex);
				_this.switchTo(_this.get('prevIndex','attr'),_this.get('activeIndex','attr'));
			}
		})
		this._upDateDisBtn();


	}
	Carousel.prototype._upDateDisBtn=function(){
		var _this=this;
		var circular=this.get('circular','attr');
		var prevBtn=this.get(this.config.prevBtn,'ele');
		var nextBtn=this.get(this.config.nextBtn,'ele');
		var len=this.get('maxMoveSteps','attr');
		if(!circular){
			var disBtnClass=_this.get('disableClass','attr');
			prevBtn.removeClass(disBtnClass);
			nextBtn.removeClass(disBtnClass);
			var index = _this.get('activeIndex','attr');
			if(index == 0 ){
				prevBtn.addClass(disBtnClass);
			}
			if(index == len - 1){
				nextBtn.addClass(disBtnClass);
			}
		}
	}
	Carousel.prototype._isSupportCss3=function(){
		if( 'MozTransition' in document.documentElement.style || 'WebkitTransition' in
		document.documentElement.style || 'OTransition' in document.documentElement.style
		|| 'msTransition' in document.documentElement.style){

		return true;

		}else{

		return false;

		}
	}
	Carousel.prototype._css3Move=function(direction,val){
		var contentBox=this.get(this.config.content,'ele');
		var dur=this.get('duration','attr');
		switch(direction){
			case 'top' :
			contentBox.css({
				'transform: ' : 'translate(0,'+ val.top  +'px)',
				'webkitTransform':'translate(0,'+ val.top  +'px)',
				'MozTransform':'translate(0,'+  val.top  +'px)',
				'msTransform':'translate(0,'+  val.top  +'px)'
			});
			break;
			case 'left' :
			contentBox.css({
				'transform: ' : 'translate('+ val.left  +'px, 0 )',
				'webkitTransform':'translate('+ val.left  +'px, 0)',
				'MozTransform':'translate('+  val.left  +'px, 0)',
				'msTransform':'translate('+  val.left  +'px, 0)'
			});
			// contentBox.animate({
			// 	'transform: ' : 'translate(0,'+ transformVal  +'px)',
			// 	'webkitTransform':'translate(0,'+ transformVal  +'px)',
			// 	'mozTransform':'translate(0,'+  transformVal  +'px)',
			// 	'msTransform':'translate(0,'+  transformVal  +'px)'
			// },dur)
		}
	}
	Carousel.prototype._css2Move=function(direction,val){
		var contentBox=this.get(this.config.content,'ele');
		var dur=this.get('duration','attr');
		switch(direction){
			case 'top' :
			contentBox.animate({
				'top' :  val + 'px'
			},dur);
			break;
			case 'left' :
			contentBox.animate({
				'left' :  val + 'px'
			},dur);
			break;
		}

	}
	Carousel.prototype._moveDirection=function(){
		var direction=this.get('direction','attr')
		switch(direction){
			case 'scrollX' : return 'left';break;
			case 'scrollY' : return 'top' ;break;
		}
	}
	Carousel.prototype._transformVal=function(){
		var reg=/\-?[0-9]+/g;
		var contentBox=this.get(this.config.content,'ele');
		switch(true){
			case 'WebkitTransform' in document.documentElement.style: return contentBox[0].style.webkitTransform.match(reg);break;
			case 'MozTransform' in document.documentElement.style: return contentBox[0].style.webkitTransform.match(reg);break;
			case 'OTransform' in document.documentElement.style: return contentBox[0].style.webkitTransform.match(reg);break;
			case 'msTransform' in document.documentElement.style: return contentBox[0].style.webkitTransform.match(reg);break;
		}
	}
	Carousel.prototype._setAutoPlay=function(){
		var _this=this;
		if(this.get('autoplay','attr')){
			this.config._addSub=1;
			this.config._timer=setInterval(autoMoveFn,this.get('autoplayTime','attr'))
			$(this.config.element).on('mouseover',function  () {
				clearInterval(_this.config._timer)
			}).on('mouseleave',function(){
				_this.config._timer=setInterval(autoMoveFn,_this.get('autoplayTime','attr'))
			})
		}
		function autoMoveFn(){
			_this.config.prevIndex=_this.get('activeIndex','attr');
			switch (_this.config._addSub){
				case 1:
					_this.config.activeIndex++;
					if(_this.config.activeIndex > _this.config.maxMoveSteps){
						_this.config.activeIndex=_this.config.maxMoveSteps;
						_this.config._addSub=-1;
					}
					break;
				case -1:
					_this.config.activeIndex--;
					if(_this.config.activeIndex < 0){
						_this.config.activeIndex=0;
						_this.config._addSub=1;
					}
					break;
			}
			// console.log(_this.config.prevIndex,_this.config.activeIndex)
			_this.switchTo(_this.config.prevIndex,_this.config.activeIndex)
		}
	},
	Carousel.prototype._resize=function(){
		var _this=this;
		var oriVal=this._findWH();
		$(window).resize(function(event) {
			clearInterval(_this.config._timer);
			var newVal=_this._findWH();
			if(oriVal != newVal){
				_this.config.showWH= newVal;
				_this._setMoveDis();
				console.log(_this);
				var curVal=Math.abs(_this._transformVal()[0] );
				// console.log(curVal)
				_this._findNearSteps(curVal);
			}
		});

	},
	Carousel.prototype._findWH=function(){
		var direction=this._moveDirection();
		switch(direction){
			case 'left' : return $(this.config.element).width();break;
			case 'top' : return $(this.config.element).height();break;
		}
	},
	Carousel.prototype._findNearSteps=function(curVal){
		var steps=0;
		var arr=[];
		// console.log(curVal)
		for(var i=0 ; i <= this.config.maxMoveSteps ; i++){
			arr[i]= { steps:i,val:Math.abs(i * this.config.steps * this.config.moveDis) - curVal};
		}
		arr.sort(function(n1,n2){
			return n2.val-n1.val
		})
		console.log(arr);
		this.switchTo(arr[0].steps,arr[0].steps - 1);

	}
	// Carousel.constructor=Carousel;
	module.exports=Carousel;
})