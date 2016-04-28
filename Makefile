.PHONY: build build-all install serve serve-all test test-all test-only

build:
	bundler exec jekyll build

build-all:
	bundler exec jekyll build --drafts --future --unpublished

install: Gemfile* Makefile
	bundle install --path vendor/bundle

serve:
	bundler exec jekyll serve --watch

serve-mobile:
	bundler exec jekyll serve --watch --host=0.0.0.0

serve-all:
	bundler exec jelyll serve --drafts --future --unpublished --watch

serve-all-mobile:
	bundler exec jelyll serve --drafts --future --unpublished --watch --host=0.0.0.0

test:
	make build && make test-only

test-all:
	make build-all && make test-only

test-only:
	bundler exec htmlproof --check-external-hash --check-favicon --check-html --url-ignore '#' _site/
