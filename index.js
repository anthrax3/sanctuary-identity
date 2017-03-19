(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-type-classes'], f);
  } else {
    self.sanctuaryIdentity = f(self.sanctuaryTypeClasses);
  }

}(function(Z) {

  'use strict';

  //  Identity :: a -> Identity a
  function Identity(value) {
    if (!(this instanceof Identity)) return new Identity(value);
    this.value = value;
  }

  Identity['@@type'] = 'sanctuary-either/Identity';

  Identity['fantasy-land/of'] = Identity;

  Identity.prototype['fantasy-land/equals'] = function(other) {
    return Z.equals(this.value, other.value);
  };

  Identity.prototype['fantasy-land/concat'] = function(other) {
    return Identity(Z.concat(this.value, other.value));
  };

  Identity.prototype['fantasy-land/map'] = function(f) {
    return Identity(f(this.value));
  };

  Identity.prototype['fantasy-land/ap'] = function(other) {
    return Z.map(other.value, this);
  };

  Identity.prototype['fantasy-land/chain'] = function(f) {
    return f(this.value);
  };

  Identity.prototype['fantasy-land/reduce'] = function(f, x) {
    return f(x, this.value);
  };

  Identity.prototype['fantasy-land/traverse'] = function(typeRep, f) {
    return Z.map(Identity, f(this.value));
  };

  Identity.prototype['fantasy-land/extend'] = function(f) {
    return Identity(f(this));
  };

  Identity.prototype['fantasy-land/extract'] = function() {
    return this.value;
  };

  Identity.prototype.inspect =
  Identity.prototype.toString = function() {
    return 'Identity(' + Z.toString(this.value) + ')';
  };

  return Identity;

}));
