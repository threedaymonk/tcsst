# tcsst

Test your CSS.

## Why?

Because life's too short to click around.

## Use it

Add jQuery and `tcsst.js` to your header:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script src="tcsst.js"></script>
```

Define your tests in terms of CSS selectors. Assert propositions using the
methods listed below:

```javascript
tcsst(function(tc){
  tc.test('top of paragraph should be at a multiple of line-height', 'p',
    function(test, element){
      var lineHeight = parseInt($('body').css('line-height'), 10);
      var diff = $(element).offset().top % lineHeight;
      test.assert((0 === diff), 'Off by ' + diff + 'px');
    });
  tc.test('something should go wrong in a badly-written test', 'em',
    function(test, element){
      throw('oh no!');
    });
});
```

Open the browser (Chrome or Firefox) and check the JavaScript console:

    Running tests:
    ...FE
    Tests: 2, Assertions: 4, Passed: 3, Failed: 1, Errors: 1
    Failed: top of paragraph should be at a multiple of line-height
    Off by 1px
    <p>
          Subsequent paragraphs are out of alignment with the vertical rhythm, and
          will cause the tests to fail. It's possible to fix the extra pixel by
          setting the line-height of code to zero or to a number less than about
          (line-height - 2px).
        </p>
    Error: something should go wrong in a badly-written test
    oh no! 

Alternatively, you can run your tests headlessly in PhantomJS directly from the
command line:

    ./test/run-test.js example.html [example2.html ...]

## Assertions

### assert(*boolean* proposition, *string* optionalMessage)

Asserts that `boolean` is true. Prints message on failure, if supplied. This is
the basic unit from which all other assertions are composed.

### assertEqual(*any* expected, *any* actual)

Asserts that `expected` and `actual` are equal, using `===`.

### assertInDelta(*number* expected, *number* actual, *number* epsilon)

Asserts that the difference between `expected` and `actual` is no more than
`epsilon`.

## Limitations

* Only tested in Chrome, Firefox, and PhantomJS
* Definitely won't work in IE at present
* No backtraces when an error occurs in a test

## To do (maybe)

* Add more assertions
* Add alternative reporters: call an endpoint, for example
