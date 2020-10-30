
var setCommand = function(button, command) {
	button.onclick = function() {
		command.execute();
	}
}

var MenuBar = {
	refresh: function() {
		console.log('刷新菜单目录');
	}
}
var SubMenu = {
	add: function() {
		console.log('增加子菜单');
	},
	del: function() {
		console.log('删除子菜单');
	}
};

var RefreshMenuBarCommand = function(receiver) {
	this.receiver = receiver;
};
RefreshMenuBarCommand.prototype.execute = function() {
	this.receiver.refresh();
};
var AddSubMenuCommand = function(receiver) {
	this.receiver = receiver;
};
AddSubMenuCommand.prototype.execute = function() {
	this.receiver.add();
};
var DelSubMenuCommand = function(receiver) {
	this.receiver = receiver;
};
DelSubMenuCommand.prototype.execute = function() {
	console.log('删除子菜单');
};
//  chapter 13 
//  职责链模式

var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500 元定金预购，得到 100 优惠券');
    } else {
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};
var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200 元定金预购，得到 50 优惠券');
    } else {
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};
var orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，无优惠券');
    } else {
        console.log('手机库存不足');
    }
};
var Chain = function(fn){
	this.fn = fn;
	this.successor = null;
}
Chain.prototype.setNextSuccessor = function(successor){
	return this.successor = successor;
}

Chain.prototype.passRequest = function(){
	var ret  = this.fn.apply(this, arguments);
	if(ret = 'nextSuccessor'){
		return this.successor && this.successor.passRequest.apply(this.successor,arguments);
	}
	return ret;
}

// 现在我们把 3 个订单函数分别包装成职责链的节点：
var chainOrder500 = new Chain( order500 );
var chainOrder200 = new Chain( order200 );
var chainOrderNormal = new Chain( orderNormal );
// 然后指定节点在职责链中的顺序：
chainOrder500.setNextSuccessor( chainOrder200 );
chainOrder200.setNextSuccessor( chainOrderNormal );
// 最后把请求传递给第一个节点：
chainOrder500.passRequest( 1, true, 500 ); // 输出： 500 元定金预购，得到 100 优惠券
chainOrder500.passRequest( 2, true, 500 ); // 输出： 200 元定金预购，得到 50 优惠券
chainOrder500.passRequest( 3, true, 500 ); // 输出：普通购买，无优惠券
chainOrder500.passRequest( 1, false, 0 ); // 

//  异步职责链
Chain.prototype.next = function(argument){
	return this.successor && this.successor.passRequest.apply(this.successor,arguments);
};

// 异步 职责链  demo
 var fn1 = new Chain(function(){
 	console.log(1);
 	return 'nextSuccessor';
 });
 var fn2 = new Chain(function (){
 	console.log(2);
 	var self = this;
 	setTimeout(function(){
 		self.next();
 	},1000);
 })
 var fn3 = new Chain(function(){
 	console.log(3);
 })

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();

//  使用AOP 实现职责链
Function.prototype.after = function(){
	var self = this;
	return function(){
		var ret = self.apply(this,arguments);
		if(ret = 'nextSuccessor'){
			return fn.apply(this,arguments);
		}
		return ret;
	}
}
// var order = order500yuan.after( order200yuan ).after( orderNormal );
// order( 1, true, 500 ); // 输出： 500 元定金预购，得到 100 优惠券

// 中介者模式
//  泡泡糖游戏 -- 中介者模式例子

function Player(name,teamColor){
	this.name = name;
	this.partners = [];
	this.enemies = [];
	this.state = 'live';
	this.teamColor = teamColor; // 队伍颜色
}

Player.prototype.win = function (){
	console.log(this.name + 'won');
}
Player.prototype.lose = function(){
	console.log(this.name + 'lost');
}
// Player.prototype.die = function (){
// 	var all_dead = true;
// 	this.state = 'dead';
// 	for(var i = 0, length1 = array.length; i < length1; i++){
// 		array[i]
// 	}
// }

var Upload = function(filename){
	this.plugin = plugin;
	this.filename = filname;
	this.button1 = null;
	this.button2 = null;
	this.state = 'sign';
}