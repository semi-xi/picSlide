function Carousel(ops) {
    var _this=this;
    this.config = {
        element: "[data-role='carousel']",
        content: "[data-carousel='content']",
        prevBtn: "[data-carousel='prev']",
        nextBtn: "[data-carousel='next']",
        disableClass: "carousel-disBtn",
        direction: 'scrollX',
        circular: false,
        duration: 300,
        steps: 1,
        _isMove:false,
        easing:'linear',
        css3:false,
        callback:function(){
            ops.cb && ops.cb();
            // console.log('动画已经结束');
            _this.config._isMove=false;
        }
        
    };
    this.config = this._extend(ops);
    this._init();
}
Carousel.prototype._init = function () {
    //初始化内容
    this._initContent();
    //初始化移动的参数
    // this._setMoveDis();
    //绑定设置
    this._bindTrigger();
    //设置自动播放
    // this._setAutoPlay();
    //设置盒子缩放
    // this._resize();
};
Carousel.prototype._initContent = function () {
    var contentBox = this.get(this.config.content, 'ele');
    var direction = this._moveDirection();
    
    var dur = this.get('duration', 'attr');
    var _this=this;
   if (this._isSupportCss3() && this.config.css3) {
       this.get(this.config.content, 'ele').css({
           'position': 'relative',
           'transform: ': 'translate(0,' + 0 + 'px)',
            'webkitTransform': 'translate(0,' + 0 + 'px)',
            'MozTransform': 'translate(0,' + 0 + 'px)',
            'msTransform': 'translate(0,' + 0 + 'px)',
           'transition': 'transform '+_this.config.easing+' ' + dur / 1000 + 's',
           'webkitTransition': '-webkit-transform '+_this.config.easing+' ' + dur / 1000 + 's',
           'MozTransition': '-moz-transform '+_this.config.easing+' ' + dur / 1000 + 's',
           'msTransition': '-ms-transform '+_this.config.easing+' ' + dur / 1000 + 's'
       })
       //绑定事件要提前加
        contentBox.on('transitionend',_this.config.callback);
        contentBox.on('webkitTransitionEnd',_this.config.callback);
        contentBox.on('oTransitionEnd',_this.config.callback);
        contentBox.on('MSTransitionEnd',_this.config.callback);
   } else {
        this.get(this.config.content, 'ele').css({
            'position': 'relative',
            'left': 0,
            'top': 0
        });
   }
    $(this.config.element).attr('data-index', 0);
    this.config.length = $(this.config.element).find(this.config.content).children().length;
    this.config.maxShowSteps=parseInt($(this.config.element).find(this.config.content).parent().width() / this.config.viewSize); //最多显示多少个
    if(this.config.length < (this.config.maxShowSteps+this.config.steps)){
        throw "the content lenth is to short!the length must greater than steps plus showLength" 
    }
    // 需要补位
    this.config.canMoveSteps=parseInt((this.config.length-this.config.maxShowSteps)/this.config.steps); //补位
    
    
    
     
    this.config.nowDirection='';
};
Carousel.prototype._extend = function (ops) {
    return $.extend(this.config, ops);
};
Carousel.prototype.get = function (str, ops) {
    if (ops == 'attr') {
        return this.config[str];
    } else {
        if (ops = 'ele') {
            return $(this.config.element).find(str).eq(0);
        }
    }

}
Carousel.prototype.set = function (attr, val) {
    this.config[attr] = val;
    return this;
}

Carousel.prototype._bindTrigger = function () {
    var _this = this;
    var prevBtn = this.get(this.config.prevBtn, 'ele');
    var nextBtn = this.get(this.config.nextBtn, 'ele');
    
    // var direction=this._findWH();
    nextBtn.on('click',function () {
        if(_this.config._isMove) return;
        var index=$(_this.config.element).attr('data-index')-0;
        _this.config._isMove=true;
        if(_this.config.nowDirection!='left'){
            _this.config.nowDirection='left';
            _this.config.directionChange=true;
        }else{
            _this.config.directionChange=false;
        }
        
        if(_this.config.circular){
            ++index;
        }else{
            index=++index >= _this.config.canMoveSteps + 1 ? (_this.config.canMoveSteps + 1) : index;
        }
        _this._css2Move(index,'left')
        
        $(_this.config.element).attr('data-index',index)
        
    })
    prevBtn.on('click',function () {
        if(_this.config._isMove) return;
        var index=$(_this.config.element).attr('data-index')-0;
        _this.config._isMove=true;
        
        if(_this.config.nowDirection!='right'){
            if(_this.config.nowDirection==''){
                _this.config.directionChange=false;
            }else{
                _this.config.directionChange=true;
            }
            _this.config.nowDirection='right';
        }else{
            _this.config.directionChange=false;
        }
        if(_this.config.circular){
            --index;
        }else{
            index=--index<=0 ? 0 : index;
        }
        _this._css2Move(index,'right')
        $(_this.config.element).attr('data-index',index)
    })

};
Carousel.prototype._upDateDisBtn = function () {
    
};
Carousel.prototype._isSupportCss3 = function () {
    
    if (('MozTransition' in document.documentElement.style || 'WebkitTransition' in
        document.documentElement.style || 'OTransition' in document.documentElement.style || 'msTransition' in document.documentElement.style )&&this.config.css3) {
       
        return true;
    } else {

        return false;

    }
};
Carousel.prototype._css3Move = function (val) {
    var contentBox = this.get(this.config.content, 'ele');
    var dur = this._moveDirection();
    switch (dur) {
    case 'top':
        contentBox.css({
            'transform: ': 'translate(0,' + val + 'px)',
            'webkitTransform': 'translate(0,' + val + 'px)',
            'MozTransform': 'translate(0,' + val + 'px)',
            'msTransform': 'translate(0,' + val + 'px)'
        });
        break;
    case 'left':
        contentBox.css({
            'transform: ': 'translate(' + val + 'px, 0 )',
            'webkitTransform': 'translate(' + val + 'px, 0)',
            'MozTransform': 'translate(' + val + 'px, 0)',
            'msTransform': 'translate(' + val + 'px, 0)'
        });
    }
    
};
Carousel.prototype._css2Move = function (index,direction) {
    
    var contentBox = this.get(this.config.content, 'ele');
    var _this=this;
    var dur = this.get('duration', 'attr');
    this._detailPos(index,direction)
    switch (this.config.direction) {
    case 'scrollY':           
        break;
    case 'scrollX':
        switch (direction) {
            case 'left':
                if(!_this.config.circular && index == _this.config.canMoveSteps+1){
                    //(不循环的时候显示的最大距离 是长度 - 最大显示个数) * 步长

                    if(_this._isSupportCss3()){
                        var transofrmVal=_this._transformVal();
                        //当达到最大值的时候，就不需要执行动画了，要不然那个isMove的函数一直无法恢复为false;
                        if(transofrmVal[0]== (-(_this.config.length-_this.config.maxShowSteps)* _this.config.viewSize)) {
                            _this.config._isMove=false;
                            return;
                        }
                        
                        _this._css3Move(-(_this.config.length-_this.config.maxShowSteps)* _this.config.viewSize)
                    }else{
                        contentBox.stop().animate({
                            left:-(_this.config.length-_this.config.maxShowSteps)* _this.config.viewSize
                        }, dur,function(){
                            _this.config._isMove=false;
                            _this.config.callback && _this.config.callback();
                        });
                    }
                   
                }else{
                    if(_this._isSupportCss3()){
                        var transofrmVal=_this._transformVal();
                        _this._css3Move(transofrmVal[0] - _this.config.viewSize * _this.config.steps)
                    }else{
                        contentBox.stop().animate({
                            left:'+='+(-_this.config.viewSize * _this.config.steps)
                        }, dur,function(){
                            _this.config._isMove=false;
                            _this.config.callback && _this.config.callback();
                        });
                    }
                }
                
                break;
                case 'right':
                if(!_this.config.circular ) {
                    if(index == 0 ){
                        if(_this._isSupportCss3()){
                            var transofrmVal=_this._transformVal();
                            if(transofrmVal[0]==0){
                                _this.config._isMove=false;
                                return ;
                            }else{
                                 _this._css3Move(0);
                            }
                           
                        }else{
                            contentBox.stop().animate({
                                left:0
                            }, dur,function(){
                                _this.config._isMove=false;
                            });
                        }
                    }else{
                        if(_this._isSupportCss3()){
                            var transofrmVal=_this._transformVal();
                            _this._css3Move(transofrmVal[0] - 0 + _this.config.viewSize * _this.config.steps);
                        }else{
                            contentBox.stop().animate({
                                left:'+='+(_this.config.viewSize * _this.config.steps)
                            }, dur,function(){
                                _this.config._isMove=false;
                            });
                        }
                    }
                } else{

                    if(_this._isSupportCss3()){
                        var transofrmVal=_this._transformVal();
                        _this._css3Move(transofrmVal[0] - 0 + _this.config.viewSize * _this.config.steps);
                    }else{
                        contentBox.stop().animate({
                            left:'+='+(_this.config.viewSize * _this.config.steps)
                        }, dur,function(){
                            _this.config._isMove=false;
                        });
                    }
                };
                    
                
            default:
                // statements_def
                break;
        }
        
        break;
    }

};
Carousel.prototype._moveClasBack=function(_this){
    
}
Carousel.prototype._moveDirection = function () {
    var direction = this.get('direction', 'attr');
    switch (direction) {
    case 'scrollX':
        return 'left';
    case 'scrollY':
        return 'top';
    }
};
Carousel.prototype._transformVal = function () {
    var reg = /\-?[0-9]+/g;
    var contentBox = this.get(this.config.content, 'ele');
   if (this._isSupportCss3()) {
       switch (true) {
       case 'WebkitTransform' in document.documentElement.style:
           return contentBox[0].style.webkitTransform.match(reg);
       case 'MozTransform' in document.documentElement.style:
           return contentBox[0].style.mozTransform.match(reg);
       case 'msTransform' in document.documentElement.style:
           return contentBox[0].style.msTransform.match(reg);
       }
   }

};
Carousel.prototype._setAutoPlay = function () {
        
};
Carousel.prototype._findWH = function () {
        var direction = this._moveDirection();
        switch (direction) {
        case 'left':
            return $(this.config.element).width();
        case 'top':
            return $(this.config.element).height();
        }
};
Carousel.prototype._detailPos = function(index,direction){
    var content=this.get(this.config.content,'ele');
    var _this=this;
    if(!this.config.circular) return;
     // 第一次挪动的数量为needMoveDom
    if(index == this.config.canMoveSteps+1 ){
        this.config.needMoveDom=this.config.maxShowSteps-(this.config.length - index * this.config.steps);
    }
    switch (direction) {
        case 'left':
            //采取一种极端一点的办法
            // 一般来说left都是大于0的 当它小于0的时候往左的时候我们可以忽略1次移动
            if(this.config.directionChange){
                return;
            } else{
                if(index >=0){
                    var baseDomIndex=((index-2)*this.config.steps)%this.config.length;
                    for( var i = baseDomIndex  ; i <baseDomIndex+this.config.steps;i++ ){
                        var domIndex=i;
                        
                        if(i>=this.config.length){
                            domIndex=i%this.config.length;
                        }
                        var nL=content.children().eq(domIndex).css('left')=='auto' ? 0 : parseInt(content.children().eq(domIndex).css('left'));
                        content.children().eq(domIndex).css({
                            position:'relative',
                            left:nL+(_this.config.length * this.config.viewSize) 
                        })
                    }
                } else{
                    var baseDomIndex=(_this.config.length-((Math.abs(index)+2)*_this.config.steps)) %_this.config.length;
                    if(baseDomIndex < 0) {
                        baseDomIndex=_this.config.length+baseDomIndex;
                    }
                    
                    for(var i= baseDomIndex  ;i< baseDomIndex+_this.config.steps;i++){
                        var domIndex = i;
                        if(i>=this.config.length){
                            domIndex=i%this.config.length;
                        }
                        var nL=content.children().eq(domIndex).css('left')=='auto' ? 0 : parseInt(content.children().eq(domIndex).css('left'));
                        
                        content.children().eq(domIndex).css({
                            position:'relative',
                            left:nL+(_this.config.length * this.config.viewSize) 
                        })
                    }
                }
            }
                
            break;
        case 'right' :
                if(this.config.directionChange){
                    return;
                } else{

                    if(index <= 0){

                        var baseDomIndex=(_this.config.length-(Math.abs(index)*_this.config.steps)) %_this.config.length;
                        if(baseDomIndex < 0) {
                            baseDomIndex=_this.config.length+baseDomIndex;
                        }
                        
                        for(var i= baseDomIndex  ;i< baseDomIndex+_this.config.steps;i++){
                            var domIndex = i;
                            if(i>=this.config.length){
                                domIndex=i%this.config.length;
                            }
                            var nL=content.children().eq(domIndex).css('left')=='auto' ? 0 : parseInt(content.children().eq(domIndex).css('left'));
                            
                            content.children().eq(domIndex).css({
                                position:'relative',
                                left:nL-(_this.config.length * this.config.viewSize) 
                            })
                        }
                        
                           
                    } else{

                         if(index >0){
                            var baseDomIndex=((index)*this.config.steps)%this.config.length;
                            for( var i = baseDomIndex  ; i <baseDomIndex+this.config.steps;i++ ){
                                
                                var domIndex=i;

                                if(i>=this.config.length){
                                    domIndex=i%this.config.length;
                                }
                                var nL=content.children().eq(domIndex).css('left')=='auto' ? 0 : parseInt(content.children().eq(domIndex).css('left'));
                                content.children().eq(domIndex).css({
                                    position:'relative',
                                    left:nL+(-_this.config.length * this.config.viewSize) 
                                })
                            }
                        }
                       
                    }
                }
                    
            break;
        default:
            break;
    }
};
Carousel.prototype.moveCallBack = function(_this){
     _this.config.callback && _this.config.callback();
     _this.config._isMove=false;
};