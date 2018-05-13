# Discover super powers of composition and inheritance in javascript with compose library

Jump to 

[Quick start](#quick-start)

[Solving problem: Composition of object with property descriptors](#discover-super-powers-of-composition-and-inheritance-in-javascript-with-compose-library)

[Solving problem: IE11 doesn't support Object.assign, Object.getOwnPropertyDescriptors]

[Solving problem: ]

## Quick start

install
```nmp
npm install @bblocks/compose --save-dev
```

include
```html
<!-- include the library -->
<script src="../compose.umd.js"></script>
```

```javascript
// Optionally create shortcuts in lodash style 
var _ = _ || {};
_.inherit = compose.inherit; 
_.compose = compose.compose; 
_.Block = compose.Block;
_.block = compose.block;
```

enjoy
```javascript

// Composition
_.compose({prop1: 1}, {prop2: 2});

// Inheritance
_.inherit({prop1: 1}, {prop2: 2}, {foo: function() {}});

// Handy object with built-in features to compose, clone and define properties
let myObj = new _.Block({prop1:1}); // Our building block
let myClone = myObj
	.mix({prop2:2}) 
	.define({
		prop3: {
			get: function() {return 3},
		}
	})
	.clone({prop4: 4});

// Check results we created
console.log(myClone.__proto__, myClone.prop1, myClone.prop2, myClone.prop3, myClone.prop4); // {...} 1 2 3 4
```


## Problem: It is hard to compose objects defined with descriptors
Since ES5 Object in javascript became more powerful. Thanks to property descriptors. 

In the first example we create and object that can display numbers with suffixes like 1M, 1k, 1b etc...

```javascript
// Display big numbers with suffixes
let bigNumber = {
	suffixes: ["", "k", "m", "b","t"],
	toString: function (value) {
		var newValue = value;
		if (value >= 1000) {
			var suffixes = this.suffixes;
			var suffixNum = Math.floor( (""+value).length/3 );
			var shortValue = '';
			for (var precision = 2; precision >= 1; precision--) {
				shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
				var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
				if (dotLessShortValue.length <= 2) { break; }
			}
			if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
			newValue = shortValue+suffixes[suffixNum];
		}
		return newValue;
	}
};
console.log('100000 = ' + bigNumber.toString(100000)); // 1000000 = 1m 
```

```javascript
// We can automatically generate a short string when value changes thanks to getters and setters 
Object.defineProperty(bigNumber, 'value', {
	get: function() {
		return this._value || 0;
	},
	set: function(newValue) {
		if (newValue != this._value) {
			this.stringValue = this.toString(newValue);
		}
		this._value = newValue;
	}
});
// Create a new instance
let myNumber = Object.create(bigNumber);
myNumber.value = 1000;
console.log(myNumber.value + ' = ' + myNumber.stringValue); // 1000 = 1k
```
I discovered a problem that we loose all properties descriptors when we try to compose two objects.

```javascript
//  Define a new feature to increment a number
let increment = {
	increment: function() {
		this.value = (this.value || 0) + 1;
	}
}

// Compose increment and big number features  
let incNumber = Object.create(increment);
Object.assign(incNumber, bigNumber);

incNumber.increment(); // value = 1;

console.log(incNumber.value); // 1
console.log(incNumber.stringValue); // undefined :(
```

So we lost all the magic after composition. Solution to this problem looks bulky.
```javascript
Object.defineProperties(incNumber, Object.getOwnPropertyDescriptors(bigNumber));
incNumber.increment(); // value = 1;
console.log(incNumber.stringValue); // 1  Yes!!!
```

But we still have a problem because Object.assign and Object.getOwnPropertyDescriptors are not supported in IE11. Oh no ;(


// Re-define our mixed object
let myIncNumber = _.inherit(increment);
_.compose(myIncNumber, bigNumber);
// or
let myIncNumber2 = _.inherit(increment, bigNumber);


myIncNumber.increment();
myIncNumber2.value = 1000;
console.log(myIncNumber.stringValue, myIncNumber2.stringValue); // 1, 1k
```

##IE11 doesn't support Object.assign, Object.getOwnPropertyDescriptors

This library includes two polyfills so you don't have to worry about this issue anymore.

