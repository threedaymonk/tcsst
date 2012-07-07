.PHONY:	lint test

SRC_FILES="tcsst.js"

all: lint test

lint:
	jshint $(SRC_FILES)

test/jquery.min.js:
	curl --silent -o $@ -L https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js

test: test/jquery.min.js
	./test/all.sh
