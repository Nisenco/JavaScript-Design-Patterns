//  代理模式
var myImage = (function(){
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	return {
		setSrc:function(src){
			imgNode.src = src;
		}
	}
})();

var proxyImage = (function(){
	var img = new Image();
	img.onload = function (){
		myImage.setSrc(this.src);
	}
	return {
		setSrc:function (src){
			myImage.setSrc( 'file:// /C:/Users/svenzeng/Desktop/loading.gif' );
			img.src = src;
		}
	}
})();

proxyImage.setSrc( 'http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg' );

// 不用代理的预加载图片函数
 var MyImage = (function(){
 	var imgNode = document.createElement('img');
 	document.body.appendChild(imgNode);
 	var img = new Image();
 	img.onload = function (){
 		img.src = src;
 	}

 	return {
 		setSrc:function (src){
 			imgNode.src =  'file:// /C:/Users/svenzeng/Desktop/loading.gif';
 			img.src = src;
 		}
 	}
 })(); 

 var synchronousFile = function(id){
 	console.log('开始同步文件： id：'+id);
 }
 var checkbox = document.getElementsByTagName('input');
 for(var i =0,c; c= checkbox[i++];){
 	c.onclick=function (){
 		if(this.checked === true){
 			synchronousFile(this.id);
 		}
 	}
 }

var proxySynchronousFile = (function(){
	var cache = [],timer;
	return function (id){
		cache.push(id);
		if(timer){
			return;
		}

		timer = setTimeout(function(){
			synchronousFile( cache.join( ',' ) ); // 2 秒后向本体发送需要同步的 ID 集合
		clearTimeout( timer ); // 清空定时器
		timer = null;
		cache.length = 0; // 清空 ID 集合
		},1000)
	}
})()

for(var i =0,c; c= checkbox[i++];){
	c.onclick=function (){
		if(this.checked === true){
			proxySynchronousFile(this.id);
		}
	}
}

// 缓存代理
// 计算乘积
var mult = function(){
	console.log( '开始计算乘积' );
	var a = 1;
	for ( var i = 0, l = arguments.length; i < l; i++ ){
		a = a * arguments[i];
	}
	return a;
};
mult( 2, 3 );
// 加入缓存代理
var proxyMult = (function(){
	var cache = {};
	return function(){
	    var args = Array.prototype.join.call( arguments, ',' );
		if ( args in cache ){
			return cache[ args ];
		}
		return cache[ args ] = mult.apply( this, arguments );
	}
})();
proxyMult( 1, 2, 3, 4 );


// 高阶函数创建代理
/**************** 计算乘积 *****************/
var mult = function(){
	var a = 1;
	for ( var i = 0, l = arguments.length; i < l; i++ ){
		a = a * arguments[i];
	}
	return a;
};
/**************** 计算加和 *****************/
var plus = function(){
	var a = 0;
	for ( var i = 0, l = arguments.length; i < l; i++ ){
		a = a + arguments[i];
	}
	return a;
};
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function( fn ){
	var cache = {};
	return function(){
		var args = Array.prototype.join.call( arguments, ',' );
		if ( args in cache ){
			return cache[ args ];
		}
		return cache[ args ] = fn.apply( this, arguments );
	}
};
var proxyMult = createProxyFactory( mult ),
proxyPlus = createProxyFactory( plus );
alert ( proxyMult( 1, 2, 3, 4 ) ); // 输出： 24