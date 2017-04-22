NPM = npm
REMEMBER_BOWER = node_modules/.bin/remember-bower
XYZ = node_modules/.bin/xyz --repo git@github.com:sanctuary-js/sanctuary-identity.git --script scripts/prepublish


.PHONY: all
all:


.PHONY: lint
lint:
	$(REMEMBER_BOWER) $(shell pwd)


.PHONY: setup
setup:
	$(NPM) install


.PHONY: test
test:
