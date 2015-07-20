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
            cb:function(){
                console.log('动画已经结束');
//                console.log(_this.config);
               
            }
        };
        this.config = this._extend(ops);
        this._init();
    }
    Carousel.prototype._init = function () {
        //初始化内容
        this._initContent();
        //初始化移动的参数
        this._setMoveDis();
        //绑定设置
        this._bindTrigger();
        //设置自动播放
        this._setAutoPlay();
        //设置盒子缩放
        this._resize();
    };
    Carousel.prototype._initContent = function () {
        var contentBox = this.get(this.config.content, 'ele');
        var direction = this._moveDirection();
        
        var dur = this.get('duration', 'attr');
//        if (this._isSupportCss3()) {
//            this.get(this.config.content, 'ele').css({
//                'position': 'relative',
//                'transform: ': 'translate(0,0)',
//                'webkitTransform': 'translate(0,0)',
//                'MozTransform': 'translate(0,0)',
//                'msTransform': 'translate(0,0)',
//                'transition': 'transform ease-in ' + dur / 1000 + 's',
//                'webkitTransition': '-webkit-transform ease-in ' + dur / 1000 + 's',
//                'MozTransition': '-moz-transform ease-in ' + dur / 1000 + 's',
//                'msTransition': '-ms-transform ease-in ' + dur / 1000 + 's'
//            })
//        } else {
            this.get(this.config.content, 'ele').css({
                'position': 'relative',
                'left': 0,
                'top': 0
            });
//        }
        if(this.config.circular){
            var html=this.get(this.config.content,'ele').html();
            this.get(this.config.content,'ele').html(html+html);
        }
        $(this.config.element).attr('data-index', 0);
        this.config.length = $(this.config.element).find(this.config.content).children().length;
        console.log(111)
         //绑定事件要提前加
        contentBox.on('transitionend',this.config.cb);
        contentBox.on('webkitTransitionEnd',this.config.cb);
        contentBox.on('oTransitionEnd',this.config.cb);
        contentBox.on('MSTransitionEnd',this.config.cb);
    };
    Carousel.prototype._extend = function (ops) {
        return $.extend(this.config, ops);
    };
    Carousel.prototype._setMoveDis = function () {
        //找到最多能走几次  以及 最后一步走多少
        var _this = this;
        // var showWH=this.config.showWH
        this.config.showWH=this._findWH(); //显示区域的宽度或者高度
        this.config.moveDis = this._getMoveDis(this.config.direction); //确定每一步走多少，以及方向 li的高度或者宽度
        var direction = this._moveDirection();
        var showLen = 1 / this.get('steps', 'attr'); //一屏显示多少个内容
        var disLen = 0;
        var isEqual=this._findMargin(); //获取 marginTop/marginleft
        switch (direction) {
        case 'left':
//            this.config.showWH = $(this.config.element).width(); //显示的高度
            showLen = this.config.showWH / this.config.moveDis;
            disLen = parseInt(showLen) - showLen; //判断是不是整数 向上取整

            this.config.maxMoveSteps = Math.ceil(Math.ceil((this.get('length', 'attr') - ($(this.config.element).width() / this.config.moveDis))) / this.get('steps', 'attr')); //最多能走多少步  总个数 - 显示的多少个
            break;
        case 'top':
//            this.config.showWH = $(this.config.element).height(); //显示的高度
            showLen = this.config.showWH / this.config.moveDis;
            disLen = parseInt(showLen) - showLen; //判断是不是整数 向上取整
            this.config.maxMoveSteps = Math.ceil(Math.ceil((this.get('length', 'attr') - ($(this.config.element).height() / this.config.moveDis))) / this.get('steps', 'attr')); //最多能走多少步
            break;
        }

        //找到最后一步需要走多少
        var _screenShowLen = Math.ceil(this.config.showWH / (this.config.moveDis * this.get('steps', 'attr')));
        switch (disLen === 0) { //判断是不是整数
        case true: //整数的话最后一步不需要走
            this.config.excessDis = 0;
            break;
        case false: //非整数的话应该需要走多一步完成剩下的距离
            this.config.excessDis = _screenShowLen * this.get('moveDis', 'attr') * this.get('steps', 'attr') - this.config.showWH;
            if(isEqual === this.config.excessDis){
                console.log('is equal');
                this.config.excessDis=this.get('moveDis', 'attr') * this.get('steps', 'attr') + this.config.excessDis;
            this.config.maxMoveSteps=this.config.maxMoveSteps - 1;
             }
            break;
        }
        
       
        this.config.maxMove = this.config.excessDis + (this.config.maxMoveSteps - 1) * (this.config.moveDis * this.config.steps);

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
        var child = this.get(this.config.content, 'ele').children(0);
        switch (direction) {
        case 'scrollX':
            return child.outerWidth() + parseInt(child.css('marginLeft')) + parseInt(child.css('marginRight'));
        case 'scrollY':
            return child.outerHeight() + parseInt(child.css('marginTop')) + parseInt(child.css('marginBottom'));

        }
    };
   
    Carousel.prototype._bindTrigger = function () {
        var _this = this;
        var prevBtn = this.get(this.config.prevBtn, 'ele');
        var nextBtn = this.get(this.config.nextBtn, 'ele');

        var maxSteps = this.get('maxMoveSteps', 'attr');
        var circular = this.get('circular', 'attr');
        prevBtn.on('click', function () {
            var nowIndex = $(_this.config.element).attr('data-index');
            //            $(this.config.element).attr('data-index',0)
//            if (!circular) {
                //不循环的情况
                _this.set('prevIndex', nowIndex);
                nowIndex = parseInt(nowIndex) - 1;
                if(!circular){
                     nowIndex = (nowIndex < 0 ? 0 : nowIndex);
                }
                _this.set('nextIndex', nowIndex);
                $(_this.config.element).attr('data-index', nowIndex);
                _this.switchTo(_this.get('prevIndex', 'attr'), _this.get('nextIndex', 'attr'));
//            }
        });
        nextBtn.on('click', function () {
            var nowIndex = $(_this.config.element).attr('data-index');
//                console.log(22);
//            if (!circular) {
                _this.set('prevIndex', nowIndex);
                nowIndex = parseInt(nowIndex) + 1;
                if(!circular){
                     console.log(nowIndex);
//                    nowIndex = ((nowIndex > len) ? len : nowIndex);
//                    nowIndex =( (nowIndex > maxSteps) && maxSteps);
                    if(nowIndex > maxSteps){
                        nowIndex= maxSteps
                    } else{
                        nowIndex=nowIndex;
                    }
                     console.log(nowIndex);
                }
                else{
                    nowIndex = nowIndex % (maxSteps + 1);
                   
                }
                
                //                console.log(_this.get('nextIndex','attr'))
                _this.set('nextIndex', nowIndex);
                $(_this.config.element).attr('data-index', nowIndex);
                _this.switchTo(_this.get('prevIndex', 'attr'), _this.get('nextIndex', 'attr'));
//            }
        });
        this._upDateDisBtn();


    };
     Carousel.prototype.switchTo = function (fromIndex, toIndex) {

        if (fromIndex == toIndex) return;
        var child = this.get(this.config.content, 'ele').children(0);
        this._upDateDisBtn();
        var contentBox = this.get(this.config.content, 'ele');
        var dis = this.get('moveDis', 'attr');

        var val = (toIndex - fromIndex) / Math.abs((toIndex - fromIndex));
        var moveVal = {};
        switch (this._moveDirection()) {
        case 'top':
            if (toIndex === (this.config.maxMoveSteps) || toIndex === 0) {
                // console.log('最后一次了')
                //距离 * 移动的距离 + 最后一次需要移动的距离 * 方向
                //方向是用自己/绝对值自己
                // val=(dis * ( fromIndex -  toIndex) * this.get('steps','attr') + this.config.excessDis * (( fromIndex -  toIndex)/Math.abs(( fromIndex -  toIndex))));


                //					if(val < 0) val= val + parseInt(child.css('marginBottom')); //最后一次的时候，当如果小于0的时候 往左走 应该把右边距忽略掉，这样可以让右边永远跟盒子的右边贴边 本身每次走的时候都会加上自己的边距
                //					if(val >= 0) val= val - parseInt(child.css('marginBottom'))
                if (val < 0) moveVal.top = 0;
                if (val > 0) moveVal.top = -this.config.maxMove + parseInt(child.css('marginBottom'));

            } else {
                //					val=dis * ( fromIndex -  toIndex) *  this.get('steps','attr')
                val = (fromIndex - toIndex) / Math.abs((fromIndex - toIndex)) * dis * this.get('steps', 'attr');
                moveVal.top = this._transformVal()[1] - 0 + val;
            }
            //				
//            if (this._isSupportCss3()) {
//
//                this._css3Move('top', moveVal);
//            } else {
                this._css2Move('top', moveVal);
//            }
            break;
        case 'left':
            if (toIndex === (this.config.maxMoveSteps) || toIndex === 0) {
                // console.log('最后一次了')
                //距离 * 移动的距离 + 最后一次需要移动的距离 * 方向
                //方向是用自己/绝对值自己
                //					if(val < 0) val= val + parseInt(child.css('marginRight')); //最后一次的时候，当如果小于0的时候 往左走 应该把右边距忽略掉，这样可以让右边永远跟盒子的右边贴边 本身每次走的时候都会加上自己的边距
                //					if(val >= 0) val= val - parseInt(child.css('marginLeft'));
                // console.log(333)
                if (val < 0) moveVal.left = 0;
                if (val > 0) moveVal.left = -this.config.maxMove + parseInt(child.css('marginRight'));
                console.log(moveVal.left)
//                    					moveVal.left=this._transformVal()[0] - 0 + val;
                    //					console.log('结束')
            } else {
                val = (fromIndex - toIndex) / Math.abs((fromIndex - toIndex)) * dis * this.get('steps', 'attr');
                moveVal.left = this._transformVal()[0] - 0 + val;
                console.log($(this.config.element).attr('data-index'))
                moveVal.left=-$(this.config.element).attr('data-index') * this.config.steps * this.config.moveDis;
            }
                
//            if (this._isSupportCss3()) {
//                this._css3Move('left', moveVal);
//            } else {
                console.log(moveVal)
                this._css2Move('left', moveVal);
//            }
            break;
        }
    };
    Carousel.prototype._upDateDisBtn = function () {
        var _this = this;
        var circular = this.get('circular', 'attr');
        var prevBtn = this.get(this.config.prevBtn, 'ele');
        var nextBtn = this.get(this.config.nextBtn, 'ele');
        var len = this.get('maxMoveSteps', 'attr');
       
        if (!circular) {
             console.log(22)
            var disBtnClass = _this.get('disableClass', 'attr');
            prevBtn.removeClass(disBtnClass);
            nextBtn.removeClass(disBtnClass);
            var index = $(_this.config.element).attr('data-index');
            console.log(index)
            if (index == 0) {
                console.log(22);
                prevBtn.addClass(disBtnClass);
            }
            if (index == len - 1) {
                nextBtn.addClass(disBtnClass);
            }
        }
    };
    Carousel.prototype._isSupportCss3 = function () {
        
        if ('MozTransition' in document.documentElement.style || 'WebkitTransition' in
            document.documentElement.style || 'OTransition' in document.documentElement.style || 'msTransition' in document.documentElement.style) {
           
            return true;

        } else {

            return false;

        }
    };
    Carousel.prototype._css3Move = function (direction, val) {
        var contentBox = this.get(this.config.content, 'ele');
        var dur = this.get('duration', 'attr');
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
                'transform: ': 'translate(' + val.left + 'px, 0 )',
                'webkitTransform': 'translate(' + val.left + 'px, 0)',
                'MozTransform': 'translate(' + val.left + 'px, 0)',
                'msTransform': 'translate(' + val.left + 'px, 0)'
            });
        }
        
    };
    Carousel.prototype._css2Move = function (direction, val) {
        var contentBox = this.get(this.config.content, 'ele');
//        if(this.config.nextIndex == 5){
//            console.log(val)
//        }
        var dur = this.get('duration', 'attr');
        switch (direction) {
        case 'top':
            contentBox.stop().animate({
                'top': val.top + 'px'
            }, dur,this.config.cb);
            break;
        case 'left':
            contentBox.stop().animate({
                'left': val.left + 'px'
            }, dur,this.config.cb);
            break;
        }

    };
    Carousel.prototype._moveClasBack=function(){
        this.config.cb && this.config.cb();
         var index=$(_this.config.element).attr('data-index');
        var maxLen=_this.config.length;
        console.log(index,maxLen);
        if(this.config.circular)
        if(index == maxLen/2){
            console.log(_this.config.prevIndex,_this.config.nextIndex);
            var child = _this.get(_this.config.content, 'ele').children(0);
            if(_this.config.prevIndex - _this.config.nextIndex < 0){
                console.log('111');
//                        _this.get(_this.config.content, 'ele').css({
//                            'webkitTransition':'none',
//                            'MozTransition':'none',
//                            'msTransition':'none'
//                        })
//                        _this._css2Move('left',{left:0});
                _this.get(_this.config.content, 'ele').css('left',0);
                $(_this.config.element).attr('data-index',0);
            } else{
                _this.get(_this.config.content, 'ele').css('left',{left:-_this.config.maxMove + child.css('marginRight')} );
            }
            console.log('到头');
        }
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
//        if (this._isSupportCss3()) {
//            switch (true) {
//            case 'WebkitTransform' in document.documentElement.style:
//                return contentBox[0].style.webkitTransform.match(reg);
//            case 'MozTransform' in document.documentElement.style:
//                return contentBox[0].style.webkitTransform.match(reg);
//            case 'OTransform' in document.documentElement.style:
//                return contentBox[0].style.webkitTransform.match(reg);
//            case 'msTransform' in document.documentElement.style:
//                return contentBox[0].style.webkitTransform.match(reg);
//            }
//        } else {
            return [contentBox.position().left, contentBox.position().top];
//        }

    };
    Carousel.prototype._setAutoPlay = function () {
            var _this = this;
            if (this.get('autoplay', 'attr')) {
                this.config._addSub = 1;
                this.config._timer = setInterval(autoMoveFn, this.get('autoplayTime', 'attr'));
                $(this.config.element).on('mouseover', function () {
                    clearInterval(_this.config._timer);
                }).on('mouseleave', function () {
                    _this.config._timer = setInterval(autoMoveFn, _this.get('autoplayTime', 'attr'));
                });
            }

            function autoMoveFn() {
                _this.config.prevIndex = _this.get('activeIndex', 'attr');
                switch (_this.config._addSub) {
                case 1:
                    _this.config.activeIndex++;
                    if (_this.config.activeIndex > _this.config.maxMoveSteps) {
                        _this.config.activeIndex = _this.config.maxMoveSteps;
                        _this.config._addSub = -1;
                    }
                    break;
                case -1:
                    _this.config.activeIndex--;
                    if (_this.config.activeIndex < 0) {
                        _this.config.activeIndex = 0;
                        _this.config._addSub = 1;
                    }
                    break;
                }
                // console.log(_this.config.prevIndex,_this.config.activeIndex)
                _this.switchTo(_this.config.prevIndex, _this.config.activeIndex);
            }
        },
    Carousel.prototype._resize = function () {
            var _this = this;
            var oriVal = this._findWH();
            $(window).resize(function (event) {
                clearInterval(_this.config._timer);
                var newVal = _this._findWH();
                if (oriVal != newVal) {
                    _this.config.showWH = newVal;
                    _this._setMoveDis();
//                    var curVal = Math.abs(_this._transformVal()[0]);
                    _this._findNearSteps(curVal);
                    oriVal = newVal;
                }
            });

        },
    Carousel.prototype._findWH = function () {
            var direction = this._moveDirection();
            switch (direction) {
            case 'left':
                return $(this.config.element).width();
            case 'top':
                return $(this.config.element).height();
            }
        },
    Carousel.prototype._findNearSteps = function (curVal) {
            //当前的移动距离 
            var steps = 0;
            var arr = [];
            for (var i = 0; i <= this.config.maxMoveSteps; i++) {
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
        }
    Carousel.prototype._findMargin=function(){
        var direction=this._moveDirection();
        var child=this.get(this.config.content,'ele').children();
        switch(direction){
                case 'top' : return parseInt(child.css('marginBottom'));
                case 'left' : return parseInt(child.css('marginRight'));
        }
    };
        // Carousel.constructor=Carousel;
    module.exports = Carousel;
});