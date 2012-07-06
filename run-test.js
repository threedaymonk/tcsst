#!/usr/bin/env phantomjs
//
// Run CSS tests agains a URL (or file) using PhantomJS.
// Sets return status to 0 on success, 1 on failure/error.
//
// Usage: ./run-test.js URL

var system = require('system');

var page = require('webpage').create();
page.onConsoleMessage = function(msg){ console.log(msg); };

var waitForTests = function(){
  var complete = page.evaluate(function(){
    if (!window.tcsst) return false;
    return window.tcsst.complete();
  });
  if (complete) {
    var ok = page.evaluate(function(){ return window.tcsst.ok(); });
    phantom.exit(ok ? 0 : 1);
  } else {
    setTimeout(waitForTests, 10);
  }
};

page.open(system.args[1], function(loaded){
  if (loaded) {
    waitForTests()
  } else {
    phantom.exit(2);
  }
});
