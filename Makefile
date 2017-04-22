DOCTEST = node_modules/.bin/doctest --module commonjs --prefix .
ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es3.json --env es3
ISTANBUL = node_modules/.bin/istanbul
NPM = npm
REMEMBER_BOWER = node_modules/.bin/remember-bower
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary-identity.git --script scripts/prepublish


.PHONY: all
all:


.PHONY: doctest
doctest:
ifeq ($(shell node --version | cut -d . -f 1),v6)
	$(DOCTEST) -- index.js
else
	@echo '[WARN] Doctests are only run in Node v6.x.x (current version is $(shell node --version))' >&2
endif


.PHONY: lint
lint:
	$(ESLINT) \
	  --global define \
	  --global module \
	  --global require \
	  --global self \
	  -- index.js
	$(ESLINT) \
	  --env node \
	  --global test \
	  -- test/index.js
	$(REMEMBER_BOWER) $(shell pwd)


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha -- --ui tdd -- test/index.js
	$(ISTANBUL) check-coverage --branches 100
	make doctest
