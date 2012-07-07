#!/usr/bin/env phantomjs
//
// Run CSS tests agains a URL (or file) using PhantomJS.
// Sets return status to 0 on success, 1 on failure/error.
//
// Usage: ./run-test.js URL

var system = require('system');
var page = require('webpage').create();
page.onConsoleMessage = function(msg){ console.log(msg); };

var runNext = function(args){
  if (0 === args.length) phantom.exit(0);

  console.log(args[0]);

  var waitForTests = function(){
    var complete = page.evaluate(function(){
      if (!window.tcsst) return false;
      return window.tcsst.complete();
    });
    if (!complete) {
      setTimeout(waitForTests, 10);
      return;
    }

    var ok = page.evaluate(function(){ return window.tcsst.ok(); });
    if (ok) {
      console.log('');
      runNext(args.slice(1));
    } else {
      phantom.exit(1);
    }
  };

  page.open(args[0], function(status){
    if ('success' === status) {
      waitForTests()
    } else {
      phantom.exit(2);
    }
  });
};

runNext(system.args.slice(1));
