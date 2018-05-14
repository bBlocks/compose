
var _ = _ || {};
Object.assign(_, window ? window.compose : global.compose);
console.log(_);

describe('compose', function() {
	it('compose objects', function() {
		var foo = function() {};
		var obj = {test:1};
	
		var obj1  = {prop1: 1, prop2: foo, prop3: obj};
		var obj2 = {prop4: 2, prop1: 2};

		expect(typeof _.compose).toBe('function');
		var obj11 = _.compose(obj1, obj2);
		expect(obj11).toBe(obj1);
		expect(obj11.prop1).toBe(2);
		expect(obj11.prop4).toBe(2);
		expect(obj11.prop3).toBe(obj);
		expect(obj11.prop2).toBe(foo);
	});

	it('Considers property descriptors too', function() {
		var obj1  = {};
		var obj2 = {};
		
		// Getters, setters
		Object.defineProperty(obj2, 'prop1', {			
			get: function() {
				return 'getProp1=' + (this._prop1 || 0);
			},
			set: function(newValue) {
				this._prop1 = newValue;
			}
		});

		// Value, writable
		Object.defineProperty(obj2, 'prop2', {
			writable: false,
			value: 'prop2ReadOnly'
		});

		// Configurable
		Object.defineProperty(obj1, 'prop3', {
			configurable: false,
			value: 'prop3Value'
		});

		// Enumerable
		Object.defineProperty(obj2, 'prop4', {
			enumerable: false,
			value: 'prop4'
		});


		_.compose(obj1, obj2);

		expect(obj1.prop1).toBe('getProp1=0');
		obj1.prop1 = 1;
		expect(obj1.prop1).toBe('getProp1=1');
		expect(obj1.prop2).toBe('prop2ReadOnly');
		obj1.prop2 = 'test';
		expect(obj1.prop2).toBe('prop2ReadOnly');

		try {
			_.compose(obj1, {prop3: 3});
		} catch(error) {
			expect(error).toBeTruthy();
		}
		expect(Object.keys(obj1).indexOf('prop4')).toBe(-1);
		expect(Object.getOwnPropertyNames(obj1).indexOf('prop4')).toBeGreaterThanOrEqual(0);

	});

	it('inherited properties', function() {
		var parent = {prop:1};
		var child = Object.create(parent);
		_.compose(child, {prop2: 2});
		expect(child.prop).toBe(1);
		var child3 = Object.create({prop3: 3});
		_.compose(child3, {prop2: 2});
		expect(child3.prop3).toBe(3);
	})
});
describe("inherit", function () {
	it("A shortcut for prototypal inheritance with composition", function () {
		var foo = function() {};
		var obj = {test:1};
		
		var obj1 = {prop1: 1, prop2: foo, prop3: obj};
		var obj2 = {prop2:2};

		var obj11 = _.inherit(obj1);
		expect(obj1.isPrototypeOf(obj11)).toBeTruthy();
		expect(obj11.prop2).toBeTruthy();
	});
});

describe("Block", function() {

	it('Can clone, mix and define properties', function() {
		// create new objects 
		var obj = new _.Block({prop1:1}); 
		expect(Object.getPrototypeOf(obj)).toBe(_.block);

		// composing with other objects
		obj.mix({prop2: 2}); 

		// configuring properties with descriptors
		obj.define({prop3: {get: function() {return 3;}}});

		// inherit
		var myClone = obj.clone({prop4: 4});

		// Checking results
		expect(myClone.prop1 + myClone.prop2 + myClone.prop3 + myClone.prop4).toBe(10); // 1 + 2 + 3 + 4 = 10
	});
});