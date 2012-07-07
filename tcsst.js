window.tcsst = (function(console, $){
  "use strict";

  // ConsoleLogReporter

  var ConsoleLogReporter = function(){
    this.results = [];
    this.errors = [];
    this.numPassed = 0;
    this.numFailed = 0;
    this.numErrors = 0;
  };

  ConsoleLogReporter.prototype.flushDots = function(){
    console.log(this.results.join(''));
    this.results = [];
  };

  ConsoleLogReporter.prototype.dot = function(glyph){
    this.results.push(glyph);
    if (this.results.length >= 72) this.flushDots();
  };

  ConsoleLogReporter.prototype.pass = function(){
    this.numPassed += 1;
    this.dot('.');
  };

  ConsoleLogReporter.prototype.fail = function(description, html){
    this.numFailed += 1;
    this.dot('F');
    this.errors.push('Failed: ' + description + '\n' + html);
  };

  ConsoleLogReporter.prototype.error = function(description, err){
    this.numErrors += 1;
    this.dot('E');
    this.errors.push('Error: ' + description + '\n' + err);
  };

  ConsoleLogReporter.prototype.start = function(){
    console.log('Running tests:');
  };

  ConsoleLogReporter.prototype.report = function(numTests){
    this.flushDots();
    console.log(
      ['Tests: '      + numTests,
       'Assertions: ' + (this.numPassed + this.numFailed),
       'Passed: '     + this.numPassed,
       'Failed: '     + this.numFailed,
       'Errors: '     + this.numErrors].join(', '));
    this.errors.forEach(function(e){ console.log('\n' + e); });
  };

  // TestCase

  var TestCase = function(){
    this.ok = true;
    this.tests = [];
    this.reporter = new ConsoleLogReporter();
  };

  TestCase.prototype.test = function(description, selector, implementation){
    var testCase = this;
    this.tests.push(function(){
      $(selector).each(function(_, element){
        var test = new Test(testCase, description, element);
        test.run(implementation);
      });
    });
  };

  TestCase.prototype.pass = function(){
    this.reporter.pass();
  };

  TestCase.prototype.fail = function(element, description){
    this.ok = false;
    this.reporter.fail(description, element.outerHTML);
    $(element).addClass('tcsst-fail');
  };

  TestCase.prototype.error = function(err, description){
    this.ok = false;
    this.reporter.error(description, err);
  };

  TestCase.prototype.run = function(){
    this.reporter.start();
    this.tests.forEach(function(t){ t(); });
    this.report();
  };

  TestCase.prototype.report = function(){
    this.reporter.report(this.tests.length);
  };

  // Test

  var Test = function(testCase, description, element){
    this.testCase = testCase;
    this.description = description;
    this.element = element;
  };

  Test.prototype.run = function(implementation){
    try {
      implementation(this, this.element);
    } catch(err) {
      this.testCase.error(err, this.description);
    }
  };

  Test.prototype.assert = function(passed, message){
    if (passed) {
      this.testCase.pass();
    } else {
      var description = this.description;
      if (message) description += '\n' + message;
      this.testCase.fail(this.element, description);
    }
  };

  Test.prototype.assertEqual = function(expected, actual){
    this.assert((expected === actual),
                'Expected ' + expected + ', got ' + actual);
  };

  Test.prototype.assertInDelta = function(expected, actual, epsilon){
    var delta = Math.abs(expected - actual);
    this.assert((delta <= epsilon),
                'Expected ' + expected + ' and ' + actual +
                ' to be within ' + epsilon + ' of each other');
  };

  // Utility

  var addCSS = function(css){
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.appendChild(document.createTextNode(css));
    head.appendChild(styleElement);
  };

  var complete = false;
  var testCases =[];

  var define = function(f){
    var testCase = new TestCase();
    f(testCase);
    testCases.push(testCase);
  };

  $(document).ready(function(){
    addCSS('.tcsst-fail { outline: 2px solid red; background-color: rgba(255,0,0,0.2); };');
    testCases.forEach(function(testCase){
      testCase.run();
    });
    complete = true;
  });

  var allTestsOK = function(){
    var failures = testCases.filter(function(tc){ return !tc.ok; }).length;
    return 0 === failures;
  };

  return {
    testCase: define,
    complete: function(){ return complete; },
    ok: allTestsOK
  };
})(window.console, window.jQuery);
