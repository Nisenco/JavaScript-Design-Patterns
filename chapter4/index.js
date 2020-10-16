// 单例模式 demo
// 单例模式 定义  保证一个类仅有一个实例，并提供一个访问它的全局访问点

var Singleton = function (name){
	this.name = name;
	this.instance = null;
}
Singleton.prototype.getName = function (){
	alert(this.name);
}
Singleton.getInstance = function(name){
	if(!this.instance){
		this.instance = new Singleton(name);
	}
	return this.instance
}

var a = Singleton.getInstance('sven1');
var b = Singleton.getInstance('sven2');

console.log(a === b);

// 透明的单例模式

var CreateDiv = (function(){
	var instance;
	var CreateDiv = function (html){
		if(instance){
			return instance;
		}
		this.html = html;
		this.init();
		return instance = this;
	}
	CreateDiv.prototype.init = function(){
		var div = document.createElement('div');
		div.innerHTML = this.html;
		document.body.appendChild(div);
	}
	return CreateDiv;
})();

var a = new CreateDiv('sven1');
var b = new CreateDiv('sven2');
console.log(a=== b);

// 用代理实现 单例模式

var CreateDiv = (function(){
	var instance;
	
	return CreateDiv;
})();
var CreateDiv = function (html){
	this.html = html;
	this.init();
}
CreateDiv.prototype.init = function(){
	var div = document.createElement('div');
	div.innerHTML = this.html;
	document.body.appendChild(div);
}

//  引入代理类 proxySingletonCreateDiv

var proxySingletonCreateDiv = (function(){
	var instance;
	return function(html){
		if(!instance){
			instance = new CreateDiv(html);
		}
		return instance;
	}
})();
var a = new proxySingletonCreateDiv('sven1');
var b = new proxySingletonCreateDiv('sven2');
console.log(a=== b);

// javascript 中的单例模式
//  单例模式的核心的 确保只有一个实例，并提供全局访问。

// 降低全局变量带来的命名污染的几种方式
// 1 使用命名空间
// demo 1 
var nameSpace1 = {
	a:function (){
		console.log(1);
	}
}
// 2 使用闭包封装私有变量
var user = (function(){
	var _name = 'seven';
	var _age = '26';
	return {
		getUserInfo:function(){
			return _name +'--' + _age;
		}
	}
})()

// 惰性单例
// 惰性单例是指在需要的时候才创建对象
var Singleton = function(name){
	this.name = name;
}
Singleton.prototype.getName = function (){
	console.log(this.name);
}
Singleton.getInstance = (function(){
	var instance;
	return function (name){
		if(!instance){
			instance = new Singleton(name);
		}
		return instance;
	}
})()

// 通用的惰性单例

var getSingle = function(fn){
	var result;
	return function(){
		return result || (result = fn.apply(this,arguments));
	}
}