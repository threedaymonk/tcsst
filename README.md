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

Define your tests:

```javascript
tcsst(function(tc){
  tc.test('paragraphs should have some property', 'p', function(test, element){
    test.assert(somethingTrue, 'Explanation in case of failure');
  });
});
```

Open the browser (Chrome or Firefox) and check the JavaSCript console:

    Running tests:
    ...FE
    Tests: undefined, Assertions: 4, Passed: 3, Failed: 1, Errors: 1
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

## Limitations

* Only tested in Chrome and Firefox
* Definitely won't work in IE at present
* No backtraces when an error occurs in a test

## To do (maybe)

* Add alternative reporters: call an endpoint, for example
* Command-line integration
