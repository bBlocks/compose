# Discover super powers of composition and inheritance in javascript with compose library

This library is a handy helper if you work with objects, inheritance and composition, like to code efficiently and need to support all modern browser and IE11 without transpiling. 

[Quick start](#quick-start)

[Solving problem #1: Composition of objects keeping property descriptors](#discover-super-powers-of-composition-and-inheritance-in-javascript-with-compose-library)

[Solving problem #2: IE11 doesn't support Object.assign, Object.getOwnPropertyDescriptors](#problem-composition-of-objects-keeping-property-descriptors)

[Solving problem #3: Bulky code to define properties, inherit and compose object using native javascript methods](#problem-bulky-code-to-define-properties-inherit-and-compose-object-using-native-javascript-methods)

[Have some fun](https://bblocks.github.io/compose/fun.html)



## Quick start

install
```nmp
npm install @bblocks/compose --save-dev
```

include in the library
```html
<!-- In HTML -->
<script src="https://cdn.jsdelivr.net/npm/@bblocks/compose@0.1.2/compose.umd.js"></script> <!--  node_modules/@bblocks/compose/compose.js -->
```
Nodejs
```
var compose = require('@bblocks/compose');
```
ES6
```
import *  as compose from 'https://cdn.jsdelivr.net/npm/@bblocks/compose@0.1.2/compose.js'; // node_modules/@bblocks/compose/compose.js
```
enjoy 
```javascript
// Optionally create shortcuts in lodash style 
var _ = Object.assign(_ || {}, compose); // Now you can use helpers from the library_.mix  _.clone _.Block _.block

// Composition
_.mix({prop1: 1}, {prop2: 2});

// Inheritance
_.clone({prop1: 1}, {prop2: 2}, {foo: function() {}});

// Handy object with built-in features to compose, clone and define properties
var myObj = new _.Block({prop1:1}); // Our building block
var myClone = myObj
	.mix({prop2:2}) 
	.define({
		prop3: {
			get: function() {return 3},
		}
	})
	.clone({prop4: 4});

// Check results
console.log(myClone.__proto__, myClone.prop1, myClone.prop2, myClone.prop3, myClone.prop4); // {...} 1 2 3 4
```

## Problem: Composition of objects keeping property descriptors
Objects became more powerful in javascript since ES5. Now we can create super powerful objects thanks to [property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

Let me show you. In the first example we create and object that can display numbers with suffixes like 1M, 1k, 1b etc...

```javascript
// Display big numbers with suffixes
var bigNumber = {
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
var myNumber = Object.create(bigNumber);
myNumber.value = 1000;
console.log(myNumber.value + ' = ' + myNumber.stringValue); // 1000 = 1k
```
I discovered a problem that we loose all property descriptors when we try to compose two objects.

```javascript
// Define a new feature to increment a number
var increment = {
	increment: function() {
		this.value = (this.value || 0) + 1;
	}
}

// Compose increment and big number features  
var incNumber = Object.create(increment);
Object.assign(incNumber, bigNumber);

incNumber.increment(); // value = 1;

console.log(incNumber.value); // 1
console.log(incNumber.stringValue); // undefined :(
```

So we lost all the magic after composition. But you can use **mix** or **clone** methods from the library to solve this problem.

```javascript
// Re-define our mixed object
var myIncNumber = _.clone(increment);
_.mix(myIncNumber, bigNumber);
// or
var myIncNumber2 = _.clone(increment, bigNumber);


myIncNumber.increment();
myIncNumber2.value = 1000;
console.log(myIncNumber.stringValue, myIncNumber2.stringValue); // 1, 1k
```

## IE11 doesn't support Object.assign, Object.getOwnPropertyDescriptors

We can use native javascript function Object.assign for composition.

```javascript
var sourceObj = {prop1:1};
Object.assign(sourceObj, {prop2: 2}); // Fails in IE11
console.log(sourceObj.prop1 + sourceObj.prop2); // 3
```
But in order to keep descriptors we need to use something like this. 

```javascript
var sourceObj = {prop1:1};
var extraObj = Object.defineProperty({}, 'prop2', {get: function() {return 2;}});
Object.defineProperties(sourceObj, Object.getOwnPropertyDescriptors(extraObj)); // Fails in IE11. Object doesn't support property or method 'getOwnPropertyDescriptors'
console.log(sourceObj.prop1 + sourceObj.prop2); // 3
```

Besides helpful **mix** and **clone** methods the library goes with two polyfills. Including the library automatically fixes the problem in IE11.

## Problem: Bulky code to define properties, inherit and compose object using native javascript methods

The example above looks bulky in native JS code. 

```javascript
var sourceObj = {prop1:1};
var extraObj = Object.defineProperty({}, 'prop2', {get: function() {return 2;}});
Object.defineProperties(sourceObj, Object.getOwnPropertyDescriptors(extraObj));
console.log(sourceObj.prop1 + sourceObj.prop2); // 3
```

Library has a bonus for you. A handy Block you can start with.

```javascript
var extraObj = (new _.Block()).define({prop2: {get: function() {return 2;}}});
var sourceObj = (new _.Block({prop1:1})).mix(extraObj);
console.log(sourceObj.prop1 + sourceObj.prop2); // 3
```

Let me explain step by step.
```javascript
// create new objects 
var obj = new _.Block({prop1:1}); 

// composing with other objects
obj.mix({prop2: 2}); 

// configuring properties with descriptors
obj.define({prop3: {get: function() {return 3;}}});

// inherit
var myClone = obj.clone({prop4: 4});

// Checking results
console.log(myClone.prop1 + myClone.prop2 + myClone.prop3 + myClone.prop4); // 1 + 2 + 3 + 4 = 10

// You can use multiple arguments and chaining
var myClone = (new _.Block({prop1: 1}))
		.mix({prop2: 2})
		.define({prop3: {get: function() {return 3;}}})
		.clone({prop4: 4});

// Checking results
console.log(myClone.prop1 + myClone.prop2 + myClone.prop3 + myClone.prop4); // 1 + 2 + 3 + 4 = 10
```