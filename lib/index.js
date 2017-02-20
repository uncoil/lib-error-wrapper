'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('lodash'),
    get = _require.get;

var defaultFields = ['statusCode', 'options', 'response.headers'];

/**
 * Recursively pull out the nested error data
 */
function getErrorData(err) {
  if (!err.error) return err;
  return getErrorData(err.error);
}

/**
 * @param {Function} target - The function to wrap. Must return a promise.
 * @param {Object} options - (optional)
 * @param {Boolean} options.raw - Skip all transformations and throw the error as it was received.
 * @param {Array<String>} options.fields - The fields to pick from the original error object.
 */
function wrapper(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function () {
    return target.apply(undefined, arguments).catch(function (err) {
      var raw = options.raw,
          _options$fields = options.fields,
          fields = _options$fields === undefined ? [] : _options$fields;

      // Exit case - do not transform

      if (raw || !err.name || err.name !== 'StatusCodeError') throw err;

      // Transform error
      var errorData = getErrorData(err);
      var error = Error(errorData.message || err.message);

      error.error = errorData;
      error.stack = err.stack;
      [].concat(defaultFields, _toConsumableArray(fields)).forEach(function (field) {
        return error[field] = get(err, field);
      });

      throw error;
    });
  };
}

module.exports = wrapper;