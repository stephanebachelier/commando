// Simple function to test if `x` is an Array
export function isArray(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}
