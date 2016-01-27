# 图片滑动插件
## 前景分析
这一类的插件不是没有，但是都没有符合自己想要的，我想要的效果很简单，满足最低要求，总长度>=显示区域+步长的情况下就可以自动完成无缝滚动。  
传统的办法是直接复制多一份dom结构出来，但是在实际的效果中的话很容易出现一个问题就是，如果我给这个dom加了事件的话就会出现问题，或者这个dom  
是带id的，这样复制过来的时候就会出现重复id，而且在逻辑上也说不通。
所以我就自己写了一个插件，参照的是阿里那边的[阿拉蕾插件]('http://aralejs.org/' 阿拉蕾插件) 中的Carousel组件，也仅仅是在命名以及部分参数上才去一致。
我的逻辑是这样的，当方向不变的情况下，如果出现空白的时候，无论空白有多少，统一补充步长个数的图片，移动的距离就是需要自己去计算的了，无缝的过程就是不断
改变这些dom相对位置的过程。  
原本我也想过采取移动到一定距离的时候选择content复位为0的办法，但是在实际的编写中发现并不是所有的情况都是复位为left：0的，也有可能是100或者其他的数值，
在这里我就选择比较简便的方法，left是一个无限增加的，我们只需要每次补位的时候挪动steps个元素就可以了。
想要看具体信息的话可以查看我的源代码。

在这里我为了兼容css3 做出了一定的兼容，在高版本的时候只需要选择css3参数的时候就会默认开启使用transform的功能。
但是考虑到了transform的特殊性，所以需要自己在写基本样式的时候增加transform为0的样式。
```css
.carousel-plugin-css3{
    transform:  translate(0,0);
    -webkit-transform: translate(0,0);
    -moz-transform: translate(0,0);
    -ms-transform: translate(0,0);
}
```

## options

### element [string]

插件的根节点 默认 `[data-role='carousel']`

### content [string]

item存放的位置 默认`[[data-carousel='content']]`

### prevBtn [string]

左边按钮的位置 默认 `[data-carousel='next']`

### nextBtn [string]

右边按钮的位置  默认`[data-carousel='next']`

### disableClass [string] 

当选择不循环的时候，达到最大值时增加的函数 默认是 `[carousel-disBtn]`

### direction [string] 

方向 目前仅仅支持scrollX 不支持其他。后面会增加scroooY  默认是 `scrollX`

### circular [boolean] 

循环设置 默认是 `false`

### duration [number]  

动画持续时间  单位是`ms` 默认是`300`


### steps [number]

步长，每次移动的个数 默认是`1`

### easing [string] 

运动函数曲线，只有当css3设置为true的时候才有用，对于css2的时候没有考虑引入jq.easing的库，所以不考虑css2的运动函数曲线,默认`linear`

#css3 [boolean]

是否对高版本浏览器进行支持，支持的话就用transform的移动代替left，默认是`false`

### cb [function]

移动过后的回调函数callback  


### opstions一览

```
{
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
}
```


## 版本

目前的话仅仅是一个测试的版本
提供2个
1个是cmd规范的，需要用seajs加载
1个是jq版本的，直接引用即可

```html
<script type="text/javascript">
    window.carousel1=new Carousel({
        element: 'div[data-role=carousel-demo1]',
        direction:'scrollX',
        autoplay: false,
        steps:3,
        circular:true,
        viewSize:100,
        css3:true,
        easing:'ease-in-out',
        duration:300,
        cb:function(){
            console.log('动画已经结束')
        }
    });
</script>
```
