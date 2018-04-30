'use strict';

const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');

const Identity = require ('..');


//    IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
const IdentityArb = arb => arb.smap (Identity, Z.extract, show);

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
