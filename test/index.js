'use strict';

const assert = require ('assert');

const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const Identity = require ('..');


//    eq :: a -> b -> Undefined !
function eq(actual) {
  assert.strictEqual (arguments.length, eq.length);
  return function eq$1(expected) {
    assert.strictEqual (arguments.length, eq$1.length);
    assert.strictEqual (show (actual), show (expected));
    assert.strictEqual (Z.equals (actual, expected), true);
  };
}

//    IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
const IdentityArb = arb => arb.smap (Identity, value, show);

//    compose :: (b -> c) -> (a -> b) -> a -> c
const compose = f => g => x => f (g (x));

//    value :: { value :: a } -> a
const value = r => r.value;


test ('equals', () => {
  eq (Z.equals (Identity ([1, 2, 3]), Identity ([1, 2, 3]))) (true);
  eq (Z.equals (Identity ([1, 2, 3]), Identity ([3, 2, 1]))) (false);
});

test ('lte', () => {
  eq (Z.lte (Identity (0), Identity (0))) (true);
  eq (Z.lte (Identity (0), Identity (1))) (true);
  eq (Z.lte (Identity (1), Identity (0))) (false);
});

test ('concat', () => {
  eq (Z.concat (Identity ([1, 2]), Identity ([3, 4]))) (Identity ([1, 2, 3, 4]));
});

test ('map', () => {
  eq (Z.map (Math.sqrt, Identity (9))) (Identity (3));
});

test ('ap', () => {
  eq (Z.ap (Identity (Math.sqrt), Identity (9))) (Identity (3));
});

test ('of', () => {
  eq (Z.of (Identity, 42)) (Identity (42));
});

test ('chain', () => {
  eq (Z.chain (compose (Identity) (Math.sqrt), Identity (9))) (Identity (3));
});

test ('alt', () => {
  eq (Z.alt (Identity ([1, 2]), Identity ([3, 4]))) (Identity ([1, 2, 3, 4]));
});

test ('reduce', () => {
  eq (Z.reduce (Z.concat, [1, 2], Identity ([3, 4]))) ([1, 2, 3, 4]);
});

test ('traverse', () => {
  eq (Z.traverse (Array, s => s.split (''), Identity ('abc')))
     ([Identity ('a'), Identity ('b'), Identity ('c')]);
});

test ('extend', () => {
  eq (Z.extend (compose (Math.sqrt) (value), Identity (9))) (Identity (3));
});

test ('extract', () => {
  eq (Z.extract (Identity (0))) (0);
});

test ('@@show', () => {
  eq (show (Identity ([1, 2, 3]))) ('Identity ([1, 2, 3])');
});

suite ('Comonad laws', () => {

  test ('left identity',
        (laws.Comonad (Z.equals)).leftIdentity (
          IdentityArb (jsc.integer)
        ));

  test ('right identity',
        (laws.Comonad (Z.equals)).rightIdentity (
          IdentityArb (jsc.integer),
          jsc.constant (identity => identity.value + 1)
        ));

});
