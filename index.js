/*             ___________________
              /                  /\
             /                  /  \
            /_____       ______/   /
            \    /      /\     \  /
             \__/      /  \_____\/
               /      /   /
              /      /   /
       ______/      /___/_
      /                  /\
     /                  /  \
    /__________________/   /
    \                  \  /
     \__________________*/

//. # sanctuary-identity
//.
//. <img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="200" height="200" align="right">
//.
//. Identity is the simplest container type: a value of type `Identity a`
//. always contains exactly one value, of type `a`.
//.
//. `Identity a` satisfies the following [Fantasy Land][] specifications:
//.
//.   - [Setoid][] (if `a` satisfies Setoid)
//.   - [Ord][] (if `a` satisfies Ord)
//.   - [Semigroup][] (if `a` satisfies Semigroup)
//.   - [Functor][]
//.   - [Apply][]
//.   - [Applicative][]
//.   - [Chain][]
//.   - [Monad][]
//.   - [Foldable][]
//.   - [Traversable][]
//.   - [Extend][]
//.   - [Comonad][]

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('sanctuary-show'),
                       require('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-show', 'sanctuary-type-classes'], f);
  } else {
    self.sanctuaryIdentity = f(self.sanctuaryShow, self.sanctuaryTypeClasses);
  }

}(function(show, Z) {

  'use strict';

  var methods = {};

  var predicates = {
    'fantasy-land/equals': Z.Setoid.test,
    'fantasy-land/lte': Z.Ord.test,
    'fantasy-land/concat': Z.Semigroup.test
  };

  //# Identity :: a -> Identity a
  //.
  //. ```javascript
  //. > Identity (42)
  //. Identity (42)
  //. ```
  function Identity(value) {
    var identity = {constructor: Identity, value: value};

    Object.keys(methods).forEach(function(name) {
      if (!(name in predicates) || predicates[name](value)) {
        identity[name] = methods[name];
      }
    });

    identity.inspect = identity['@@show'];

    return identity;
  }

  //# Identity.@@type :: String
  //.
  //. ```javascript
  //. > Identity['@@type']
  //. 'sanctuary-identity/Identity@1'
  //. ```
  Identity['@@type'] = 'sanctuary-identity/Identity@1';

  //# Identity.fantasy-land/of :: a -> Identity a
  //.
  //. ```javascript
  //. > Z.of (Identity, 42)
  //. Identity (42)
  //. ```
  Identity['fantasy-land/of'] = Identity;

  //# Identity#fantasy-land/equals :: Setoid a => Identity a ~> Identity a -> Boolean
  //.
  //. ```javascript
  //. > Z.equals (Identity ([1, 2, 3]), Identity ([1, 2, 3]))
  //. true
  //.
  //. > Z.equals (Identity ([1, 2, 3]), Identity ([3, 2, 1]))
  //. false
  //. ```
  methods['fantasy-land/equals'] = function(other) {
    return Z.equals(this.value, other.value);
  };

  //# Identity#fantasy-land/lte :: Ord a => Identity a ~> Identity a -> Boolean
  //.
  //. ```javascript
  //. > Z.lte (Identity (0), Identity (0))
  //. true
  //.
  //. > Z.lte (Identity (0), Identity (1))
  //. true
  //.
  //. > Z.lte (Identity (1), Identity (0))
  //. false
  //. ```
  methods['fantasy-land/lte'] = function(other) {
    return Z.lte(this.value, other.value);
  };

  //# Identity#fantasy-land/concat :: Semigroup a => Identity a ~> Identity a -> Identity a
  //.
  //. ```javascript
  //. > Z.concat (Identity ([1, 2, 3]), Identity ([4, 5, 6]))
  //. Identity ([1, 2, 3, 4, 5, 6])
  //. ```
  methods['fantasy-land/concat'] = function(other) {
    return Identity(Z.concat(this.value, other.value));
  };

  //# Identity#fantasy-land/map :: Identity a ~> (a -> b) -> Identity b
  //.
  //. ```javascript
  //. > Z.map (Math.sqrt, Identity (64))
  //. Identity (8)
  //. ```
  methods['fantasy-land/map'] = function(f) {
    return Identity(f(this.value));
  };

  //# Identity#fantasy-land/ap :: Identity a ~> Identity (a -> b) -> Identity b
  //.
  //. ```javascript
  //. > Z.ap (Identity (Math.sqrt), Identity (64))
  //. Identity (8)
  //. ```
  methods['fantasy-land/ap'] = function(other) {
    return Identity(other.value(this.value));
  };

  //# Identity#fantasy-land/chain :: Identity a ~> (a -> Identity b) -> Identity b
  //.
  //. ```javascript
  //. > Z.chain (n => Identity (n + 1), Identity (99))
  //. Identity (100)
  //. ```
  methods['fantasy-land/chain'] = function(f) {
    return f(this.value);
  };

  //# Identity#fantasy-land/reduce :: Identity a ~> ((b, a) -> b, b) -> b
  //.
  //. ```javascript
  //. > Z.reduce (Z.concat, [1, 2, 3], Identity ([4, 5, 6]))
  //. [1, 2, 3, 4, 5, 6]
  //. ```
  methods['fantasy-land/reduce'] = function(f, x) {
    return f(x, this.value);
  };

  //# Identity#fantasy-land/traverse :: Applicative f => Identity a ~> (TypeRep f, a -> f b) -> f (Identity b)
  //.
  //. ```javascript
  //. > Z.traverse (Array, x => [x, x], Identity (0))
  //. [Identity (0), Identity (0)]
  //. ```
  methods['fantasy-land/traverse'] = function(typeRep, f) {
    return Z.map(Identity, f(this.value));
  };

  //# Identity#fantasy-land/extend :: Identity a ~> (Identity a -> b) -> Identity b
  //.
  //. ```javascript
  //. > Z.extend (identity => Z.extract (identity) + 1, Identity (99))
  //. Identity (100)
  //. ```
  methods['fantasy-land/extend'] = function(f) {
    return Identity(f(this));
  };

  //# Identity#fantasy-land/extract :: Identity a ~> () -> a
  //.
  //. ```javascript
  //. > Z.extract (Identity (42))
  //. 42
  //. ```
  methods['fantasy-land/extract'] = function() {
    return this.value;
  };

  //# Identity#@@show :: Identity a ~> () -> String
  //.
  //. ```javascript
  //. > show (Identity ([1, 2, 3]))
  //. 'Identity ([1, 2, 3])'
  //. ```
  methods['@@show'] = function() {
    return 'Identity (' + show(this.value) + ')';
  };

  return Identity;

}));

//. [Applicative]:      v:fantasyland/fantasy-land#applicative
//. [Apply]:            v:fantasyland/fantasy-land#apply
//. [Chain]:            v:fantasyland/fantasy-land#chain
//. [Comonad]:          v:fantasyland/fantasy-land#comonad
//. [Extend]:           v:fantasyland/fantasy-land#extend
//. [Fantasy Land]:     v:fantasyland/fantasy-land
//. [Foldable]:         v:fantasyland/fantasy-land#foldable
//. [Functor]:          v:fantasyland/fantasy-land#functor
//. [Monad]:            v:fantasyland/fantasy-land#monad
//. [Ord]:              v:fantasyland/fantasy-land#ord
//. [Semigroup]:        v:fantasyland/fantasy-land#semigroup
//. [Setoid]:           v:fantasyland/fantasy-land#setoid
//. [Traversable]:      v:fantasyland/fantasy-land#traversable
