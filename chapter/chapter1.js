// var duck = {
// 	duckSingsing :function(){
// 		console.log("嘎嘎")；
// 	}
// }
// var chicken = {
// 	duckSingsing:function(){
// 		console.log('嘎嘎');
// 	}
// }

var func = function(a,b,c,d){
	console.log(a);
	console.log(b);
	console.log(c);
}
func.apply(null,[1,2,3,4]);

//  简单版本  bind 函数

Function.prototype.bind = function(context){
	var _this = this;
	return function(){
		return _this.apply(context,arguments);
	}
}

// 复杂版本 bind 实现
Function.prototype.bind = function(context){
	var _this = this,
		context = [].shift.call(arguments),
		args = [].slice.call(arguments);
	return function(){
		return _this.apply(context,[].concat(args,[].slice.call(arguments)));
	}
};

var cost = (function(){
	var args = [];
	return function (){
		if(arguments.length === 0){
			var money = 0;
			for (var i = 0, l = args.length; i < l; i++) {
				money += args[0];
			}
			return money;
		}else{
			[].push.apply(args,arguments);
		}
	}
})()

// console.log(cost(12));
// console.log(cost(12));
// console.log(cost(),'end');
// 节流函数
var throttle = function(fn,interval){
	var _self = fn,
	timer,
	firstTime = true;
	return function(){
		var args = arguments,
			_me = this;
		if(firstTime){
			_self.apply(fn,args);
			return firstTime = false;
		}
		if(timer){
			return false;
		}
		timer = setTimeout(function(){
         	clearTimeout(timer);
         	timer = null;
         	_self.apply(_me,args)
		},interval|| 500)
	}
}

/*
	ary: 创建节点需要用到的参数
	fn： 创建节点逻辑的函数
	count： 每一批创建的节点数量
*/ 
var timeChunk = function (ary,fn,count){
	var obj,t;
	var len = ary.length;
	var start = function (){
		for(var i = 0;i<Math.min(count||1,ary.length);i++){
			var obj = ary.shift();
			fn(obj);
		}
	}
	return function(){
		t = setInterval(function(){
			if(ary.length === 0){
				return clearInterval(t);
			}
			start();
		},600)
	}
}
var ary = [];
for(var i = 1;i<1000;i++){
	ary.push(i);
}
var renderFriendList = timeChunk(ary,function(n){
	var div = document.createElement('div');
	div.innerHTML = n;
	document.body.appendChild(div);
},8)

// renderFriendList();