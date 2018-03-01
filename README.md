# Building Blocks Component 
<img align="right" alt="bBlocks" src="https://github.com/bBlocks/component/blob/master/block.png?raw=true" width="100"/>

Use the best parts of the Web to build [efficient](https://github.com/bBlocks/sandbox/wiki/Intro) web applications. 

Build your components once and use everywhere. A lightweight and extremenly modular solution. Designed to reduced costs and maximize profit. 

Reliable. [Few simple APIs](https://bblocks.github.io/component/api/bb.html) . Consistent forever. The rest is just your imagination.

## Quick start

* Install

```
npm install @bblocks/component
```

* Create an HTML page.
```HTML
<!DOCTYPE html>
<html>

<head>
	<title>Component</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="node_modules/@bblocks/component/component.polyfills.min.js"></script>
	<script src="node_modules/@bblocks/component/component.js"></script>
</head>
<body>
	<my-field-element class="form-control"></my-field-element>
	<script>
		bb.component({
			is: 'my-field-element',
			on: {
				attach: function() {
					this.innerHTML = 'Hello!';
				}
			}

		});
	</script>
</body>

</html>
```
* You are now free to build the Web!

## Demo
* [Demo page](https://bblocks.github.io/component/)
* JSFiddle [example](https://jsfiddle.net/webrealizer/az23mrbz/) 

## Documentation
* [API](https://bblocks.github.io/component/api/bb.html)

## Special
<img align="right" alt="Composition" src="https://github.com/bBlocks/component/blob/master/blocks.png?raw=true" width="200"/>

* Create Features and define Components.
* Lifecycle events.
* Extend native DOM elements.
* Transpiling is not required.
* Supports all modern browsers and IE11.