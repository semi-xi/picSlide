define('carousel', function (require, exports, module) {
    var $ = require("$-debug");

    function Carousel(ops) {
        var _this=this;
        this.config = {
            element: "[data-role='carousel']",
            triggers: "[data-switchable-role='nav']",
            content: "[data-switchable-role='content']",
            prevBtn: "[data-switchable-role='prev']",
            nextBtn: "[data-switchable-role='next']",
            disableClass: "carousel-disBtn",
            prevIndex: 0,
            nextIndex: 0,
            direction: 'scrollX',
            circular: false,
            autoplay: false,
            duration: 300,
            moveDis: 0,
            steps: 1,
            autoplayTime: 2000,
            showWH: 0,
            _timer: null,
            _isMove:false,
            callback:function(){
                console.log('动画已经结束');
            },
            
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
        switch (this.config.direction) {
            case 'scrollX':
                this.config.showWH=contentBox.parent().width();
                break;
            case 'scrollY':
                this.config.showWH=contentBox.parent().height();
                break;
            default:
                // statements_def
                break;
        }
       // if (this._isSupportCss3()) {
       //     this.get(this.config.content, 'ele').css({
       //         'position': 'relative',
       //         'transform: ': 'translate(0,0)',
       //         'webkitTransform': 'translate(0,0)',
       //         'MozTransform': 'translate(0,0)',
       //         'msTransform': 'translate(0,0)',
       //         'transition': 'transform ease-in ' + dur / 1000 + 's',
       //         'webkitTransition': '-webkit-transform ease-in ' + dur / 1000 + 's',
       //         'MozTransition': '-moz-transform ease-in ' + dur / 1000 + 's',
       //         'msTransition': '-ms-transform ease-in ' + dur / 1000 + 's'
       //     })
       // } else {
            this.get(this.config.content, 'ele').css({
                'position': 'relative',
                'left': 0,
                'top': 0
            });
       // }
        $(this.config.element).attr('data-index', 0);
        this.config.length = $(this.config.element).find(this.config.content).children().length;
        this.config.maxShowSteps=parseInt($(this.config.element).find(this.config.content).parent().width() / this.config.viewSize); //最多显示多少个
        if(this.config.length < (this.config.maxShowSteps+this.config.steps)){
            throw "the content lenth is to short!the length must greater than steps plus showLength" 
        }
        // 需要补位
        //(length - wh) / steps
        this.config.canMoveSteps=parseInt((this.config.length-this.config.maxShowSteps)/this.config.steps); //补位
        // console.log(this.config.canMoveSteps)
        //第1次需要移动多少个元素
        //(length - showLength) % steps
        // this.config.needMoveDom=(this.config.length-this.config.maxShowSteps)% this.config.steps == 0 ? this.config.steps : (this.config.length-this.config.maxShowSteps)% this.config.steps;
        
        // 判断需要第几次复位
        // this.config.backPos=Math.ceil(this.config.length / this.config.steps);
        // console.log(this.config.backPos)
         //绑定事件要提前加
        // contentBox.on('transitionend',this.config.cb);
        // contentBox.on('webkitTransitionEnd',this.config.cb);
        // contentBox.on('oTransitionEnd',this.config.cb);
        // contentBox.on('MSTransitionEnd',this.config.cb);
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
    Carousel.prototype._getMoveDis = function (direction) {
        
    };
   
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
                _this.config.nowDirection='right';
                _this.config.directionChange=true;
            }else{
                _this.config.directionChange=false;
            }
            if(_this.config.circular){
                --index;
            }else{
                index=0;
            }
            _this._css2Move(index,'right')
            $(_this.config.element).attr('data-index',index)
        })

    };
     Carousel.prototype.switchTo = function (toIndex) {
        var direction=this._findWH();
        _this._css2Move(toIndex)
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
    Carousel.prototype._css3Move = function (direction, val) {
        var contentBox = this.get(this.config.content, 'ele');
        var dur = this.get('duration', 'attr');
        console.log(dur)
        switch (direction) {
        case 'top':
            contentBox.css({
                'transform: ': 'translate(0,' + val.top + 'px)',
                'webkitTransform': 'translate(0,' + val.top + 'px)',
                'MozTransform': 'translate(0,' + val.top + 'px)',
                'msTransform': 'translate(0,' + val.top + 'px)'
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
                        // if(_this._isSupportCss3()){

                        // }else{
                            contentBox.stop().animate({
                                left:-(_this.config.length-_this.config.maxShowSteps)* _this.config.viewSize
                            }, dur,function(){
                                _this.config._isMove=false;
                            });
                        // }
                       
                    }else{
                        // if(_this._isSupportCss3()){
                            
                        // }else{
                            contentBox.stop().animate({
                                left:'+='+(-_this.config.viewSize * _this.config.steps)
                            }, dur,function(){
                                _this.config._isMove=false;
                            });
                        // }
                    }
                    
                    break;
                    case 'right':
                    contentBox.stop().animate({
                        left:'+='+(_this.config.viewSize * _this.config.steps)
                    }, dur,function(){
                        _this.config._isMove=false;
                    });
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
               return contentBox[0].style.webkitTransform.match(reg);
           case 'OTransform' in document.documentElement.style:
               return contentBox[0].style.webkitTransform.match(reg);
           case 'msTransform' in document.documentElement.style:
               return contentBox[0].style.webkitTransform.match(reg);
           }
       } else {
            return [contentBox.position().left, contentBox.position().top];
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
    Carousel.prototype._findNearSteps = function (curVal) {
            //当前的移动距离 
            var steps = 0;
            var arr = [];
            for (var i = 0; i <= this.config.maxShowSteps; i++) {
                arr[i] = {
                    steps: i,
                    val: i * this.config.steps * this.config.moveDis - curVal
                };
            }
            arr.sort(function (n1, n2) {
                return n2.val - n1.val;
            });
            if (arr[0].steps > 0) {
                this.switchTo(arr[0].steps - 1, arr[0].steps);
                $(this.config.element).attr('data-index', arr[0].steps);
            } else {
                this.switchTo(0, 0);
                $(this.config.element).attr('data-index', 0);
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
                if(index >=0){
                    if(this.config.directionChange){
                        return ;
                    } else{
                        var baseDomIndex=((index-2)*this.config.steps)%this.config.length;
                        for( var i = baseDomIndex  ; i <baseDomIndex+this.config.steps;i++ ){
                            var domIndex=i;

                            if(i==this.config.length){
                                domIndex=0;
                            }
                            var nL=content.children().eq(domIndex).css('left')=='auto' ? 0 : parseInt(content.children().eq(domIndex).css('left'));
                            content.children().eq(domIndex).css({
                                position:'relative',
                                left:nL+(_this.config.length * this.config.viewSize) 
                            })
                        }
                    }
                } else{
                    if(this.config.directionChange){
                        return ;
                    } else{
                        var baseDomIndex=(_this.config.length-((Math.abs(index)+2)*_this.config.steps)) %_this.config.length;
                        if(baseDomIndex < 0) {
                            baseDomIndex=_this.config.length+baseDomIndex;
                        }
                        
                        for(var i= baseDomIndex  ;i< baseDomIndex+_this.config.steps;i++){
                            var domIndex = i;
                            if(i==_this.config.length){
                                domIndex=0;
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
                    if(index <= 0){
                        var baseDomIndex=(_this.config.length-(Math.abs(index)*_this.config.steps)) %_this.config.length;
                        if(baseDomIndex < 0) {
                            baseDomIndex=_this.config.length+baseDomIndex;
                        }
                        
                        for(var i= baseDomIndex  ;i< baseDomIndex+_this.config.steps;i++){
                            var domIndex = i;
                            if(i==_this.config.length){
                                domIndex=0;
                            }
                            var nL=content.children().eq(domIndex).css('left')=='auto' ? 0 : parseInt(content.children().eq(domIndex).css('left'));
                            
                            content.children().eq(domIndex).css({
                                position:'relative',
                                left:nL-(_this.config.length * this.config.viewSize) 
                            })
                        }
                    } else{
                        if(this.config.directionChange){
                            return ;
                        } else{
                             if(index >=0){
                                var baseDomIndex=((index)*this.config.steps)%this.config.length;
                                // console.l
                                for( var i = baseDomIndex  ; i <baseDomIndex+this.config.steps;i++ ){
                                    
                                    var domIndex=i;

                                    if(i==this.config.length){
                                        domIndex=0;
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
    module.exports = Carousel;
});