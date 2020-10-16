// 策略模式
// 策略模式是指 定义一系列的算法，把他们一个个的封装起来，并且使他们可以互相替换
//  一个基于策略模式实现的程序至少由两部分组成。
// 第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程
// 第二部分是环境类（Context），context接受客户的请求，随后把请求委托给某一个策略类。
// 

// 基于传统面向对象语言的模仿策略模式
var performanceS = function(){};
performanceS.prototype.calculate = function(salary){
	return salary*4;
}
var performanceA = function(){};
performanceA.prototype.calculate = function(salary){
	return salary*3;
}
var performanceB = function(){};
performanceB.prototype.calculate = function(salary){
	return salary*2;
}

// 定义奖金类
var Bonus = function (){
	this.salary = null; // 原始工资
	this.strategy = null; // 绩效等级对应的策略对象
}
Bonus.prototype.setSalary = function (salary){
	this.salary = salary;
}
Bonus.prototype.setSrategy = function (strategy){
	this.strategy = strategy;
}
Bonus.prototype.getBouns = function (){
	return this.strategy.calculate(this.salary); // 把计算的奖金操作委托给对应的策略对象
}

var bonus = new Bonus();
bonus.setSalary(1000);
bonus.setSrategy(new performanceS());
console.log(bonus.getBouns())

// JavaScript 版本的策略模式

var strategies = {
	'S':function (salary){
		return salary * 4;
	},
	'A':function (salary){
		return salary * 3;
	},
	'B':function (salary){
		return salary * 2;
	}
}
var calculateBonus = function(level,salary){
	return strategies[level](salary);
}
console.log(calculateBonus('S',3000));

//  使用策略模式实现缓动动画

var tween = {
	linear:function (t,b,c,d){
		return c*t/d + b;
	},
	easeIn:function(t,b,c,d){
		return c*(t /= d)*t +b;
	},
	strongEaseIn:function(t,b,c,d){
		return c * ( t /= d ) * t * t * t * t + b;
	},
	strongEaseOut: function(t, b, c, d){
		return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b;
	},
	sineaseIn: function( t, b, c, d ){
		return c * ( t /= d) * t * t + b;
	},
	sineaseOut: function(t,b,c,d){
		return c * ( ( t = t / d - 1) * t * t + 1 ) + b;
	}
}
var Animate = function (dom){
	this.dom = dom; // 进行运动的DOm 节点
	this.startTime = 0; // 动画开始的时间
	this.startPos = 0; // 动画开始时 dom 节点的位置，即 dom 的初始位置
	this.endPos = 0;   // 动画结束时 dom 节点的位置，即 dom 的目标位置
	this.propertyName = null; // dom 节点需要被改变的属性
	this.easing = null; // 缓动算法
	this.duration = null; // 动画持续时间
}
// propertyName：要改变的 CSS 属性名，比如'left'、 'top'，分别表示左右移动和上下移动
// endPos： 小球运动的目标位置。
// duration： 动画持续时间
// easing： 缓动算法
Animate.prototype.start = function(propertyName,endPos,duration,easing){
	this.startTime = +new Date;
	this.startPos = this.dom.getBoundingClientRect()[propertyName] ;// dom 节点初始位置
	this.propertyName = propertyName;
	this.endPos = endPos;
	this.duration = duration;
	this.easing = tween[easing];

	var self = this;
	var timeId = setInterval(function() {
		if(self.step() === false){
			clearInterval(timeId);
		}
	}, 19)
}
Animate.prototype.step = function(){
	var t = +new Date;
	if(t >= this.startTime + this.duration){
		this.update(this.endPos);
		return false;
	}
	var pos  = this.easing(t-this.startTime,this.startPos,this.endPos-this.startPos,this.duration);
	this.update(pos);
}

Animate.prototype.update = function(pos){
	this.dom.style[this.propertyName] = pos + 'px';
}

// var div = document.getElementById( 'div' );
// var animate = new Animate( div );
// animate.start( 'left', 500, 1000, 'strongEaseOut' );

//  表单校验

var strategies = {
	isNonEmpty:function(value,errorMsg){
		if(value ==''){
			return errorMsg;
		}
	},
	minLength:function(value,length,errorMsg){
		if(value.length < length){
			return errorMsg;
		}
	},
	isMobile:function(value,errorMsg){
		if(!/(1[3|5|8][0-9]{9}$)/.test(value)){
			return errorMsg;
		}
	}
}

var validataFunc = function(){
	// 校验器
	var validator = new Validator();
	// 添加校验规则
	validator.add(registerForm.userName,'isNonEmpty','用户名不能为空');
	validator.add(registerForm.password,'minLength:6','密码长度不能少于6位');
	validator.add(registerForm.phoneNumber,'isMobile','手机号格式不正确');
	var errorMsg = validator.start();
	return errorMsg;
}

var registerForm = document.getElementById('registerForm');
console.log('')
registerForm.onsubmit = function(){
	var errorMsg = validataFunc();
	if(errorMsg){
		alert(errorMsg);
		return false;
	}
}

var Validator = function(){
	this.cache = []; // 保存校验规则
};
Validator.prototype.add = function(dom,rule,errorMsg){
	var ary = rule.split(':');
	this.cache.push(function(){
		var strategy = ary.shift();
		ary.unshift(dom.value);
		ary.push(errorMsg);
		console.log(ary,'----errorMsg-----');
		return strategies[strategy].apply(dom,ary)
	});
}
Validator.prototype.start = function(){
	for(var i = 0, validataFunc; validataFunc= this.cache[i++];){
		var msg = validataFunc();
		if(msg){
			return msg;
		}
	}
} 
