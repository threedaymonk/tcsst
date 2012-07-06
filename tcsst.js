tcsst = (function(){

  // ConsoleLogReporter

  var ConsoleLogReporter = function(){
    this.results = [];
    this.errors = [];
    this.numPassed = 0;
    this.numFailed = 0;
    this.numErrors = 0;
  };

  ConsoleLogReporter.prototype.pass = function(){
    this.numPassed += 1;
    this.results.push('.');
  };

  ConsoleLogReporter.prototype.fail = function(description, html){
    this.numFailed += 1;
    this.results.push('F');
    this.errors.push('Failed: ' + description + '\n' + html);
  };

  ConsoleLogReporter.prototype.error = function(description, err){
    this.numErrors += 1;
    this.results.push('E');
    this.errors.push('Error: ' + description + '\n' + err);
  };

  ConsoleLogReporter.prototype.start = function(){
    console.log('Running tests:');
  };

  ConsoleLogReporter.prototype.report = function(numTests){
    console.log(this.results.join(''));
    console.log(
      ['Tests: '      + numTests,
       'Assertions: ' + (this.numPassed + this.numFailed),
       'Passed: '     + this.numPassed,
       'Failed: '     + this.numFailed,
       'Errors: '     + this.numErrors].join(', '));
    this.errors.forEach(function(e){ console.log(e); });
  };

  // TestCase

  var TestCase = function(){
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
    this.reporter.fail(description, element.outerHTML);
    $(element).addClass('tcsst-fail');
  };

  TestCase.prototype.error = function(err, description){
    this.reporter.error(description, err);
  };

  TestCase.prototype.run = function(){
    this.reporter.start();
    this.tests.forEach(function(t){ t() });
    this.report();
  };

  TestCase.prototype.report = function(){
    this.reporter.report();
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

  // Utility

  var addCSS = function(css){
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.appendChild(document.createTextNode(css));
    head.appendChild(styleElement);
  };

  var define = function(f){
    var testCase = new TestCase();
    f(testCase);
    $(document).ready(function(){
      addCSS('.tcsst-fail { outline: 2px solid red; background-color: rgba(255,0,0,0.2); };');
      testCase.run();
    });
  };

  return define;
})();
