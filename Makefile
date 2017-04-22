DOCTEST = node_modules/.bin/doctest --module commonjs --prefix .
ESLINT = node_modules/.bin/eslint --config node_modules/sanctuary-style/eslint-es3.json --env es3
ISTANBUL = node_modules/.bin/istanbul
NPM = npm
REMARK = node_modules/.bin/remark --frail --no-stdout
REMEMBER_BOWER = node_modules/.bin/remember-bower
TRANSCRIBE = node_modules/.bin/transcribe
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary-identity.git --script scripts/prepublish


.PHONY: all
all: README.md

README.md: README.md.tmp package.json scripts/version-urls
	scripts/version-urls '$<' >'$@'

.INTERMEDIATE: README.md.tmp
README.md.tmp: index.js
	$(TRANSCRIBE) \
	  --heading-level 4 \
	  --url 'https://github.com/sanctuary-js/sanctuary-identity/blob/v$(VERSION)/{filename}#L{line}' \
	  -- $^ \
	| LC_ALL=C sed 's/<h4 name="\(.*\)#\(.*\)">\(.*\)\1#\2/<h4 name="\1.prototype.\2">\3\1#\2/' >'$@'


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
	rm -f README.md
	VERSION=0.0.0 make README.md
	$(REMARK) \
	  --use remark-lint-no-undefined-references \
	  --use remark-lint-no-unused-definitions \
	  -- README.md
	git checkout README.md


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha -- --ui tdd -- test/index.js
	$(ISTANBUL) check-coverage --branches 100
	make doctest
