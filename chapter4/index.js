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

