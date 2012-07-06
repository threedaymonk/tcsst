.PHONY:	lint test

SRC_FILES="tcsst.js"

all: lint

lint:
	jshint $(SRC_FILES)
