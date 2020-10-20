// 迭代器模式 是指提供一种方法顺序访问一个聚合对象中的各个元素,而又不需要暴露该对象的内部表示.
// 作用: 可以把迭代的过程中从业务逻辑中分离出来,在使用迭代器模式之后,即使不关心对象的内部构造,也可以按照顺序访问其中的每个元素.

// 实现自己的迭代器
var each = function(ary, callback) {
	for (var i = 0, l = ary.length; i < l; i++) {
		callback.call(ary[i], i, ary[i]);
	}
}
console.log(each([1, 2, 3], function(i, d) {
	console.log('i=>:', i, 'd=>', d);
}))

// 迭代器分为 内部迭代器和外部迭代器

//  内部迭代器
// 优点： 调用方便，外界不用关心迭代器内部的实现，
// 缺点： 由于内部迭代器的迭代规则已经被提前规定，上面的each函数无法同事迭代2个数组


// 比如有个需求 要判断2个数组里元素的值是否完全相等，如果不改写each函数本身的代码，我们能入手的地方似乎只剩下each的回调函数
// 代码如下
var compare = function(ary1, ary2) {
	if (ary1.length != ary2.length) {
		throw new Error('ary1 和 ary2 不相等');
	}
	each(ary1, function(i, n) {
		if (n != ary2[i]) {
			throw new Error('ary1 和 ary2 不相等');
		}
	})
	alert('ary1 和 ary2 相等');
};

// 外部迭代器 

var Iterator = function(obj) {
	var current = 0;
	var next = function() {
		current += 1;
	}
	var isDone = function() {
		return current >= obj.length;
	}
	var getCurrItem = function(item) {
		return obj[current];
	}
	return {
		next: next,
		isDone: isDone,
		getCurrItem: getCurrItem,
	}
}

var compare = function(iterator1, iterator2) {
	while (!iterator1.isDone() && !iterator2.isDone()) {
		if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
			throw new Error('ary1 和 ary2 不相等');
		}
		iterator1.next();
		iterator2.next();
	}
	alert('ary1 和 ary2 相等');
}
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);
// compare( iterator1, iterator2 );

//  倒叙迭代
var reverseEach = function(ary, callback) {
	for (var l = ary.length; l >= 0; l--) {
		callback(1, ary[l]);
	}
}
console.log(reverseEach([1, 2, 3], function(i, n) {
	console.log(n)
}))


// 发布订阅模式
var event = {
	clientList: [],
	listen: function(key, fn) {
		if (!this.clientList[key]) {
			this.clientList[key] = [];
		}
		this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
	},
	trigger: function() {
		var key = Array.prototype.shift.call(arguments), // (1);
			fns = this.clientList[key];
		if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
			return false;
		}
		for (var i = 0, fn; fn = fns[i++];) {
			fn.apply(this, arguments); // (2) // arguments 是 trigger 时带上的参数
		}
	},
	remove: function(key, fn) {
		var fns = this.clientList[key];
		if (!fns) {
			return false;
		}
		if (!fn) { // 如果没有传入具体的回调函数，表示要取消key 对应消息的所有订阅
			fns && (fns.length = 0)
		} else {
			for (var l = fns.length - 1; l >= 0; l--) {
				var _fn = fns[l];
				if (_fn === fn) {
					fns.splice(l, 1);
				}
			}
		}
	}
};
var installEvent = function(obj) {
	for (var i in event) {
		obj[i] = event[i]
	}
}

//  全局的发布-订阅模式
var Event = (function() {
	var clientList = {},
		listen,
		trigger,
		remove;
	listen = function(key, fn) {
		if (!clientList[key]) {
			clientList[key] = [];
		}
		clientList[key].push(fn);
	}
	trigger = function() {
		var key = Array.prototype.shift.call(arguments),
			fns = clientList[key];
		if (!fns || fns.length == 0) {
			return false;
		}
		for (var i = 0, fn; fn = fns[i++];) {
			fn.apply(this, arguments);
		}
	}
	remove = function(key, fn) {
		var fns = clientList[key];
		if (!fns) {
			return false;
		}
		if (!fn) {
			fns && (fns.length = 0);
		} else {
			for (var l = fns.length - 1; l >= 0; l--) {
				var _fn = fns[l];
				if (_fn === fn) {
					fns.splice(l, 1);
				}
			}
		}
	}
	return {
		listen: listen,
		trigger: trigger,
		remove: remove,
	}
})()
// 全局事件的命名冲突
var Event = (function() {
	var global = this,
		Event,
		_default = 'default';
	Event = function() {
		var _listen,
			_trigger,
			_remover,
			_slice = Array.prototype.slice,
			_shift = Array.prototype.shift,
			_unshift = Array.prototype.unshift,
			namespaceCache = {},
			_creat,
			find,
			each = function(ary, fn) {
				var ret;
				for (var i = 0, l = ary.length; i < l; i++) {
					var n = ary[i];
					ret = fn.call(n, i, n);
				}
				return ret;
			};
		_remove = function(key, cache, fn) {
			if (cache[key]) {
				if (fn) {
					for (var i = cache[key].length; i >= 0; i--) {
						if (cache[key][i] === fn) {
							cache[key].splice(i, 1);
						}
					}
				} else {
					cache[key] = [];
				}
			}
		};
		_trigger = function() {
			var cache = _shift.call(arguments),
				key = _shift.call(arguments),
				args = arguments,
				_self = this,
				ret,
				stack = cache[key];
			if (!stack || !stack.length) {
				return;
			}
			return each(stack, function() {
				return this.apply(_self, args);
			});
		};
		_creat = function (namespace){
			var namespace = namespace || _default;
			var cache = {},
			offlineStack = [],
			ret = {
				listen:function(key,fn,last){
					_listen(key,fn,cache);
					if(offlineStack === null){
						return;
					}
					if(last === 'last'){
						offlineStack.length && offlineStack.pop()();
					}else{
						each(offlineStack,function(){
							this();
						})
					}
					offlineStack = null;
				},
				one:function(key,fn,last){
					_remove(key,cache);
					this.listen(key,fn,last);
				},
				remove:function(key,fn){
					_remove(key,cache,fn);
				},
				trigger: function(){
					var fn,
					args,
					_self = this;
					_unshift.call(arguments,cache);
					args = arguments;
					fn = function(){
						return _trigger.apply(_self,args);
					};
					if(offlineStack){
						return offlineStack.push(fn);
					}
					return fn();
				};
			}
			return namespace?(
					namespaceCache[namespace]? namespaceCache[namespace]:namespaceCache[namespace] = ret
				):ret
		};
		return {
			creat:_creat,
			one:function(key,fn,last){
				var event = this.creat();
				event.one(key,fn,last);
			},
			remove:function(key,fn){
				var event = this.creat();
				event.remove(key,fn);
			},
			listen:function (key,fn,last){
				var event = this.create();
				event.listen(key,fn,last);
			},
			trigger: function(){
				var event = this.create();
				event.trigger.apply(this,arguments);
			}
		}
	}

	return Event;
})()