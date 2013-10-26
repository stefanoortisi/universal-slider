POLVO=node_modules/polvo/bin/polvo
CS=node_modules/coffee-script/bin/coffee
MOCHA=node_modules/mocha/bin/mocha

COVERALLS=node_modules/coveralls/bin/coveralls.js

MVERSION=node_modules/mversion/bin/version
VERSION=0.2.1

setup:
	npm install
	bower install


watch:
	@$(CS) -bwo lib src

build:
	@$(CS) -bco lib src



bump.minor:
	@$(MVERSION) minor

bump.major:
	@$(MVERSION) major

bump.patch:
	@$(MVERSION) patch

publish:
	git tag $(VERSION)
	git push origin $(VERSION)
	git push origin master
	npm publish

re-publish:
	git tag -d $(VERSION)
	git tag $(VERSION)
	git push origin :$(VERSION)
	git push origin $(VERSION)
	git push origin master -f
	npm publish -f



# TEST
# ------------------------------------------------------------------------------

test: build
	@$(MOCHA) --compilers coffee:coffee-script \
		--ui bdd \
		--reporter spec \
		--timeout 600000 \
		test/runner.coffee --env='local'
