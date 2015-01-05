/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/utility/tgi-core-strings.spec.js
 */

spec.test('tgi-utility/lib/tgi-utility-strings.test.js', 'String Functions', 'description', function (callback) {
  callback({log: 'tgi-utility/lib/tgi-utility-strings.test.js'});
  spec.heading('STRING FUNCTIONS', function () {
    spec.heading('trim(string)', function () {
      spec.example('Remove leading and trailing spaces from string', '(hello)', function () {
        return '(' + trim(' hello ') + ')';
      });
    });
    spec.heading('ltrim(string)', function () {
      spec.example('Remove leading spaces from string', '(hello )', function () {
        return '(' + ltrim(' hello ') + ')';
      });
    });
    spec.heading('rtrim(string)', function () {
      spec.example('Remove trailing spaces from string', '( hello)', function () {
        return '(' + rtrim(' hello ') + ')';
      });
    });
    spec.heading('left(string)', function () {
      spec.example('return left part of string', '123', function () {
        return left('12345',3);
      });
    });
    spec.heading('right(string)', function () {
      spec.example('return right part of string', '345', function () {
        return right('12345',3);
      });
    });
    spec.heading('center(string)', function () {
      spec.example('return center part of string', '234', function () {
        return center('12345',3);
      });
    });
    spec.heading('lpad(string, length, fillChar)', function () {
      spec.paragraph('Return string size length with fillChar padded on left.  ' +
      'fillChar is optional and defaults to space.');
      spec.example('add leading asteriks', '********42', function () {
        return lpad('42', 10, '*');
      });
      spec.example('truncate when length is less than string length', 'ok', function () {
        return lpad('okay', 2);
      });
      spec.example('fillChar defaults to space', ': x:', function () {
        return ':' + lpad('x',2) + ':';
      });
    });
    spec.heading('rpad(string, length, fillChar)', function () {
      spec.paragraph('Return string size length with fillChar padded on right.  ' +
      'fillChar is optional and defaults to space.');
      spec.example('Add trailing periods', 'etc...', function () {
        return rpad('etc', 6, '.');
      });
      spec.example('truncate when length is less than string length', 'sup', function () {
        return rpad('wassup', 3);
      });
      spec.example('fillChar defaults to space', ':x :', function () {
        return ':' + rpad('x',2) + ':';
      });
    });
    spec.heading('cpad(string, length, fillChar)', function () {
      spec.paragraph('Return string size length with fillChar padded on left and right.  ' +
      'fillChar is optional and defaults to space.');
      spec.example('center with periods', '...center....', function () {
        return cpad('center', 13, '.');
      });
      spec.example('truncate when length is less than string length', 'cd', function () {
        return cpad('abcdef', 2);
      });
      spec.example('fillChar defaults to space', ': x :', function () {
        return ':' + cpad('x',3) + ':';
      });
    });
  });
});
