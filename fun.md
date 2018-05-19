# Want to have some fun with Objects? 

Let's use [compose library](index.html) to  build a mini incremental game.


## Install and include the library.

```html
<!-- include the library -->
<script src="https://cdn.jsdelivr.net/npm/@bblocks/compose@0.1.1/compose.umd.js"></script>
```

```javascript
// Optionally create shortcuts in lodash style 
var _ = Object.assign(_ || {}, compose); // Now you can use it like _.mix(...)  _.clone(...)  new _.Block(...) _.block

```

## Create a big number feature

We can improve our [original example](index.html#discover-super-powers-of-composition-and-inheritance-in-javascript-with-compose-library) to make it more efficient.

```javascript

// Display big numbers with suffixes
var bigNumber = new _.Block({
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
}).define({ // Note how it is easier to define property descriptors
	'value': {
		get: function() {
			return this._value || 0;
		},
		set: function(newValue) {
			if (newValue != this._value) {
				this.stringValue = this.toString(newValue);

				// Display if we can 
				if (this.innerHTML !== undefined) {
					this.innerHTML = this.stringValue;
				} 
			}
			this._value = newValue;
		}
	}
});

// Check bigNumber
console.log('100000 = ' + bigNumber.toString(100000)); // 1000000 = 1m 
```
## Define incremental features.
```javascript
// Define a new feature to increment a number
var increment = new _.Block({
	amount: 1, // Incremental step
	increment: function(amount) {
		this.value = (this.value || 0) + (amount || this.amount || 1);
	}
});

// Check increment
{
	let obj = increment.clone(); // Create a new instance 
	obj.increment(2);
	console.log('Increment 0 + 2 = ', obj.value); // Increment 0 + 2 = 2
}
```

## Create a powerful button that can display  bigNumber and increment
```javascript
// Create a dom element and add more features to it
function createComponent(name, feature1, feature2, feature3) {
	var el = document.createElement(name);

	// Add our "Block" features but override clone method since we can't inherit directly from DOM elements
	arguments[0] = _.mix(el, _.block, {
		clone: function() {
			Array.prototype.unshift.call(arguments, createComponent(this.tagName, this));
			return _.mix.apply(null, arguments);
		}
	});
	var featuredElement = _.mix.apply(null, arguments); // Using composition to add features to the DOM element
	return featuredElement;
}

// Increment on click
let btn = createComponent('button', bigNumber, increment); // Note how easy we can create more powerful DOM elements
btn.addEventListener('click', function () {
	this.increment();
});
btn.increment(); // initial value

// Add to the DOM
var container = document.querySelector('#example-1-') || document.body;
container.appendChild(btn);
```

### Example 1: 

## Now we can clone our button to create more powerful buttons :smiling_imp:
```javascript
var biggerBtn = btn.clone({amount: 1000}); 
biggerBtn.addEventListener('click', function () {
	this.increment();
});
biggerBtn.increment();
var container = document.querySelector('#example-2-') || document.body;
container.appendChild(biggerBtn);
```

### Example 2: 

Hope you enjoyed it!