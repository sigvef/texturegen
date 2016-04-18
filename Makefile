.PHONY: test
test:
	echo "All good!"

.PHONY: gh-pages
gh-pages:
	test $$TRAVIS_PULL_REQUEST
	test $$TRAVIS_BRANCH
	test $$TRAVIS_PULL_REQUEST = false
	test $$TRAVIS_BRANCH = master
	git remote add upstream "https://$$GH_TOKEN@github.com/sigvef/texturegen.git"
	git push -fq upstream HEAD:gh-pages
