.PHONY:	lint test

SRC_FILES="tcsst.js"

all: lint test

lint:
	jshint $(SRC_FILES)

test:
	./test/all.sh
