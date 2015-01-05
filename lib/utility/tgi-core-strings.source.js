/**---------------------------------------------------------------------------------------------------------------------
 * tgi-core/lib/utility/tgi-core-strings.source.js
 */

/**
 * left(string, size) - left substring
 */
var left = function (string, size) {
  return string.substring(0, size);
};
/**
 * right(string, size) - right substring
 */
var right = function (string, size) {
  return string.substring(string.length - size, string.length);
};
/**
 * center(string, size) - center substring
 */
var center = function (string, size) {
  var start = (string.length - size)/2;
  return string.substring(start, start+size);
};
/**
 * trim(s) - remove trailing and leading spaces
 */
var trim = function (s) {
  return s.replace(/^\s+|\s+$/g, '');
};
/**
 * ltrim(s) - remove leading spaces
 */
var ltrim = function (s) {
  return s.replace(/^\s+/, '');
};
/**
 * rtrim(s) - remove trailing spaces
 */
var rtrim = function (s) {
  return s.replace(/\s+$/, '');
};
/**
 * lpad(string, length, fillChar) - pad string left to length filling with fillChar
 */
var lpad = function (expr, length, fillChar) {
  fillChar = fillChar || ' ';
  var string = '' + expr;
  if (string.length > length) {
    return left(string, length);
  } else {
    while (string.length < length) {
      string = fillChar + string;
    }
  }
  return string;
};
/**
 * rpad(string, length, fillChar) - pad string right to length filling with fillChar
 */
var rpad = function (expr, length, fillChar) {
  fillChar = fillChar || ' ';
  var string = '' + expr;
  if (string.length > length) {
    return right(string, length);
  } else {
    while (string.length < length) {
      string = string + fillChar;
    }
  }
  return string;
};
/**
 * cpad(string, length, fillChar) - pad string right & left to length filling with fillChar
 */
var cpad = function (expr, length, fillChar) {
  fillChar = fillChar || ' ';
  var string = '' + expr;
  var totalPad = length - string.length;
  if (string.length > length) {
    return center(string, length);
  } else {
    //if (totalPad > 0) {
      var leftPad = string.length + Math.floor(totalPad / 2);
      string = lpad(string, leftPad, fillChar);
      string = rpad(string, length, fillChar);
    //}
  }
  return string;
};