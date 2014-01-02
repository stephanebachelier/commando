"use strict";
function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

exports.isArray = isArray;