'use strict';

var assert = require('assert');

var Z = require('sanctuary-type-classes');

var Identity = require('..');


//  eq :: (Any, Any) -> Undefined !
function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(Z.toString(actual), Z.toString(expected));
  assert.strictEqual(Z.equals(actual, expected), true);
}

//  compose :: (b -> c, a -> b) -> a -> c
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

//  value :: { value :: a } -> a
function value(r) {
  return r.value;
}


test('equals', function() {
  eq(Z.equals(Identity([1, 2, 3]), Identity([1, 2, 3])), true);
  eq(Z.equals(Identity([1, 2, 3]), Identity([3, 2, 1])), false);
});

test('lte', function() {
  eq(Z.lte(Identity(0), Identity(0)), true);
  eq(Z.lte(Identity(0), Identity(1)), true);
  eq(Z.lte(Identity(1), Identity(0)), false);
});

test('concat', function() {
  eq(Z.concat(Identity([1, 2]), Identity([3, 4])), Identity([1, 2, 3, 4]));
});

test('map', function() {
  eq(Z.map(Math.sqrt, Identity(9)), Identity(3));
});

test('ap', function() {
  eq(Z.ap(Identity(Math.sqrt), Identity(9)), Identity(3));
});

test('chain', function() {
  eq(Z.chain(compose(Identity, Math.sqrt), Identity(9)), Identity(3));
});

test('alt', function() {
  eq(Z.alt(Identity([1, 2]), Identity([3, 4])), Identity([1, 2, 3, 4]));
});

test('reduce', function() {
  eq(Z.reduce(Z.concat, [1, 2], Identity([3, 4])), [1, 2, 3, 4]);
});

test('traverse', function() {
  eq(Z.traverse(Array, function(s) { return s.split(''); }, Identity('abc')),
     [Identity('a'), Identity('b'), Identity('c')]);
});

test('extend', function() {
  eq(Z.extend(compose(Math.sqrt, value), Identity(9)), Identity(3));
});

test('extract', function() {
  eq(Z.extract(Identity(0)), 0);
});

test('toString', function() {
  eq(Z.toString(Identity([1, 2, 3])), 'Identity([1, 2, 3])');
});
