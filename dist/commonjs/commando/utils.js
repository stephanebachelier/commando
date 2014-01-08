"use strict";
// Simple function to test if `x` is an Array
function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

exports.isArray = isArray;