# sanctuary-identity

Identity is the simplest container type: a value of type `Identity a`
always contains exactly one value, of type `a`.

<img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="100" height="100">

`Identity a` satisfies the following [Fantasy Land][] specifications:

  - [Setoid][] (if `a` satisfies Setoid)
  - [Ord][] (if `a` satisfies Ord)
  - [Semigroup][] (if `a` satisfies Semigroup)
  - [Functor][]
  - [Apply][]
  - [Applicative][]
  - [Chain][]
  - [Monad][]
  - [Alt][] (if `a` satisfies Alt)
  - [Foldable][]
  - [Traversable][]
  - [Extend][]
  - [Extract][]

<h4 name="Identity"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L63">Identity :: a -⁠> Identity a</a></code></h4>

```javascript
> Identity(42)
Identity(42)
```

<h4 name="Identity.@@type"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L74">Identity.@@type :: String</a></code></h4>

```javascript
> Identity['@@type']
'sanctuary-either/Identity'
```

<h4 name="Identity.fantasy-land/of"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L82">Identity.fantasy-land/of :: a -⁠> Identity a</a></code></h4>

```javascript
> Z.of(Identity, 42)
Identity(42)
```

<h4 name="Identity.prototype.fantasy-land/equals"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L90">Identity#fantasy-land/equals :: Setoid a => Identity a ~> Identity a -⁠> Boolean</a></code></h4>

```javascript
> Z.equals(Identity([1, 2, 3]), Identity([1, 2, 3]))
true

> Z.equals(Identity([1, 2, 3]), Identity([3, 2, 1]))
false
```

<h4 name="Identity.prototype.fantasy-land/lte"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L103">Identity#fantasy-land/lte :: Ord a => Identity a ~> Identity a -⁠> Boolean</a></code></h4>

```javascript
> Z.lte(Identity(0), Identity(0))
true

> Z.lte(Identity(0), Identity(1))
true

> Z.lte(Identity(1), Identity(0))
false
```

<h4 name="Identity.prototype.fantasy-land/concat"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L119">Identity#fantasy-land/concat :: Semigroup a => Identity a ~> Identity a -⁠> Identity a</a></code></h4>

```javascript
> Z.concat(Identity([1, 2, 3]), Identity([4, 5, 6]))
Identity([1, 2, 3, 4, 5, 6])
```

<h4 name="Identity.prototype.fantasy-land/map"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L129">Identity#fantasy-land/map :: Identity a ~> (a -⁠> b) -⁠> Identity b</a></code></h4>

```javascript
> Z.map(Math.sqrt, Identity(64))
Identity(8)
```

<h4 name="Identity.prototype.fantasy-land/ap"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L139">Identity#fantasy-land/ap :: Identity a ~> Identity (a -⁠> b) -⁠> Identity b</a></code></h4>

```javascript
> Z.ap(Identity(Math.sqrt), Identity(64))
Identity(8)
```

<h4 name="Identity.prototype.fantasy-land/chain"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L149">Identity#fantasy-land/chain :: Identity a ~> (a -⁠> Identity b) -⁠> Identity b</a></code></h4>

```javascript
> Z.chain(n => Identity(n + 1), Identity(99))
Identity(100)
```

<h4 name="Identity.prototype.fantasy-land/alt"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L159">Identity#fantasy-land/alt :: Alt a => Identity a ~> Identity a -⁠> Identity a</a></code></h4>

```javascript
> Z.alt(Identity([1, 2, 3]), Identity([4, 5, 6]))
Identity([1, 2, 3, 4, 5, 6])
```

<h4 name="Identity.prototype.fantasy-land/reduce"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L169">Identity#fantasy-land/reduce :: Identity a ~> ((b, a) -⁠> b, b) -⁠> b</a></code></h4>

```javascript
> Z.reduce(Z.concat, [1, 2, 3], Identity([4, 5, 6]))
[1, 2, 3, 4, 5, 6]
```

<h4 name="Identity.prototype.fantasy-land/traverse"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L179">Identity#fantasy-land/traverse :: Applicative f => Identity a ~> (TypeRep f, a -⁠> f b) -⁠> f (Identity b)</a></code></h4>

```javascript
> Z.traverse(Array, x => [x, x], Identity(0))
[Identity(0), Identity(0)]
```

<h4 name="Identity.prototype.fantasy-land/extend"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L189">Identity#fantasy-land/extend :: Identity a ~> (Identity a -⁠> b) -⁠> Identity b</a></code></h4>

```javascript
> Z.extend(identity => Z.extract(identity) + 1, Identity(99))
Identity(100)
```

<h4 name="Identity.prototype.fantasy-land/extract"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L199">Identity#fantasy-land/extract :: Identity a ~> () -⁠> a</a></code></h4>

```javascript
> Z.extract(Identity(42))
42
```

<h4 name="Identity.prototype.toString"><code><a href="https://github.com/sanctuary-js/sanctuary-identity/blob/v0.0.0/index.js#L209">Identity#toString :: Identity a ~> () -⁠> String</a></code></h4>

```javascript
Z.toString(Identity([1, 2, 3]))
'Identity([1, 2, 3])'
```

[Alt]:              https://github.com/fantasyland/fantasy-land/tree/v3.2.0#alt
[Applicative]:      https://github.com/fantasyland/fantasy-land/tree/v3.2.0#applicative
[Apply]:            https://github.com/fantasyland/fantasy-land/tree/v3.2.0#apply
[Chain]:            https://github.com/fantasyland/fantasy-land/tree/v3.2.0#chain
[Extend]:           https://github.com/fantasyland/fantasy-land/tree/v3.2.0#extend
[Extract]:          https://github.com/fantasyland/fantasy-land/tree/v3.2.0#extract
[Fantasy Land]:     https://github.com/fantasyland/fantasy-land/tree/v3.2.0
[Foldable]:         https://github.com/fantasyland/fantasy-land/tree/v3.2.0#foldable
[Functor]:          https://github.com/fantasyland/fantasy-land/tree/v3.2.0#functor
[Monad]:            https://github.com/fantasyland/fantasy-land/tree/v3.2.0#monad
[Ord]:              https://github.com/fantasyland/fantasy-land/tree/v3.2.0#ord
[Semigroup]:        https://github.com/fantasyland/fantasy-land/tree/v3.2.0#semigroup
[Setoid]:           https://github.com/fantasyland/fantasy-land/tree/v3.2.0#setoid
[Traversable]:      https://github.com/fantasyland/fantasy-land/tree/v3.2.0#traversable
