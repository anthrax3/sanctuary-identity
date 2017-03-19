NPM = npm
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary-identity.git --script scripts/prepublish


.PHONY: all
all:


.PHONY: lint
lint:


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
