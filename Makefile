.PHONY: gh-pages
gh-pages:
	test $$TRAVIS_PULL_REQUEST
	test $$TRAVIS_BRANCH
	test $$TRAVIS_PULL_REQUEST = "false"
	# test $$TRAVIS_BRANCH = "master
	git fetch upstream
	git checkout gh-pages
	git reset --hard master
	git push -f origin gh-pages
