const { get } = require('lodash');

const defaultFields = ['statusCode', 'options', 'response.headers'];

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
function wrapper(target, options = {}) {
  return (...args) => {
    return target(...args)
      .catch((err) => {
        const { raw, fields = [] } = options;

        // Exit case - do not transform
        if (raw || !err.name || err.name !== 'StatusCodeError') throw err;

        // Transform error
        const errorData = getErrorData(err);
        const error = Error(errorData.message || err.message);

        error.error = errorData;
        error.stack = err.stack;
        [...defaultFields, ...fields].forEach(field => error[field] = get(err, field));

        throw error;
      });
  }
}

module.exports = wrapper;
