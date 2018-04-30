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

//    NonEmpty :: Arbitrary a -> Arbitrary (NonEmpty a)
const NonEmpty = arb => jsc.suchthat (arb, x => not (empty (x)));

//    NumberArb :: Arbitrary Number
const NumberArb = jsc.oneof (
  jsc.constant (NaN),
  jsc.constant (-Infinity),
  jsc.constant (Number.MIN_SAFE_INTEGER),
  jsc.constant (-10000),
  jsc.constant (-9999),
  jsc.constant (-0.5),
  jsc.constant (-0),
  jsc.constant (0),
  jsc.constant (0.5),
  jsc.constant (9999),
  jsc.constant (10000),
  jsc.constant (Number.MAX_SAFE_INTEGER),
  jsc.constant (Infinity)
);

//    compose :: (b -> c) -> (a -> b) -> a -> c
const compose = f => g => x => f (g (x));

//    empty :: Monoid m => m -> Boolean
const empty = m => Z.equals (m, Z.empty (m.constructor));

//    not :: Boolean -> Boolean
const not = b => !b;

//    testLaws :: Object -> Object -> Undefined
const testLaws = laws => arbs => {
  (Object.keys (laws)).forEach (name => {
    test (name.replace (/[A-Z]/g, c => ' ' + c.toLowerCase ()),
          laws[name].apply (laws, arbs[name]));
  });
};

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

suite ('Setoid laws', () => {
  testLaws (laws.Setoid) ({
    reflexivity: [
      IdentityArb (NumberArb),
    ],
    symmetry: [
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
    ],
    transitivity: [
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
    ],
  });
});

suite ('Ord laws', () => {
  testLaws (laws.Ord) ({
    totality: [
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
    ],
    antisymmetry: [
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
    ],
    transitivity: [
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
      IdentityArb (NumberArb),
    ],
  });
});

suite ('Semigroup laws', () => {
  testLaws (laws.Semigroup (Z.equals)) ({
    associativity: [
      IdentityArb (jsc.string),
      IdentityArb (jsc.string),
      IdentityArb (jsc.string),
    ],
  });
});

suite ('Filterable laws', () => {
  testLaws (laws.Filterable (Z.equals)) ({
    distributivity: [
      IdentityArb (jsc.array (NumberArb)),
      jsc.constant (x => x >= 0),
      jsc.constant (isFinite),
    ],
    identity: [
      IdentityArb (jsc.array (NumberArb)),
    ],
    annihilation: [
      IdentityArb (jsc.array (NumberArb)),
      IdentityArb (jsc.array (NumberArb)),
    ],
  });
});

suite ('Functor laws', () => {
  testLaws (laws.Functor (Z.equals)) ({
    identity: [
      IdentityArb (NumberArb),
    ],
    composition: [
      IdentityArb (NumberArb),
      jsc.constant (Math.sqrt),
      jsc.constant (Math.abs),
    ],
  });
});

suite ('Apply laws', () => {
  testLaws (laws.Apply (Z.equals)) ({
    composition: [
      IdentityArb (jsc.constant (Math.sqrt)),
      IdentityArb (jsc.constant (Math.abs)),
      IdentityArb (NumberArb),
    ],
  });
});

suite ('Applicative laws', () => {
  testLaws (laws.Applicative (Z.equals, Identity)) ({
    identity: [
      IdentityArb (NumberArb),
    ],
    homomorphism: [
      jsc.constant (Math.abs),
      NumberArb,
    ],
    interchange: [
      IdentityArb (jsc.constant (Math.abs)),
      NumberArb,
    ],
  });
});

suite ('Chain laws', () => {
  testLaws (laws.Chain (Z.equals)) ({
    associativity: [
      IdentityArb (jsc.asciistring),
      jsc.constant (s => Identity (s.replace (/[A-Z]/g, ''))),
      jsc.constant (s => Identity (s.toUpperCase ())),
    ],
  });
});

suite ('Monad laws', () => {
  testLaws (laws.Monad (Z.equals, Identity)) ({
    leftIdentity: [
      jsc.constant (x => Identity ([x, x])),
      IdentityArb (NumberArb),
    ],
    rightIdentity: [
      IdentityArb (NumberArb),
    ],
  });
});

suite ('Foldable laws', () => {
  testLaws (laws.Foldable (Z.equals)) ({
    associativity: [
      jsc.constant (Z.concat),
      jsc.string,
      IdentityArb (jsc.string),
    ],
  });
});

suite ('Traversable laws', () => {
  testLaws (laws.Traversable (Z.equals)) ({
    naturality: [
      jsc.constant (Array),
      jsc.constant (Identity),
      jsc.constant (xs => Identity (xs[0])),
      IdentityArb (NonEmpty (jsc.array (NumberArb))),
    ],
    identity: [
      jsc.constant (Array),
      IdentityArb (NumberArb),
    ],
    composition: [
      jsc.constant (Array),
      jsc.constant (Identity),
      IdentityArb (jsc.array (IdentityArb (NumberArb))),
    ],
  });
});

suite ('Extend laws', () => {
  testLaws (laws.Extend (Z.equals)) ({
    associativity: [
      IdentityArb (jsc.integer),
      jsc.constant (identity => Z.extract (identity) + 1),
      jsc.constant (identity => Math.pow (Z.extract (identity), 2)),
    ],
  });
});

suite ('Comonad laws', () => {
  testLaws (laws.Comonad (Z.equals)) ({
    leftIdentity: [
      IdentityArb (NumberArb),
    ],
    rightIdentity: [
      IdentityArb (NumberArb),
      jsc.constant (identity => Math.pow (Z.extract (identity), 2)),
    ],
  });
});
