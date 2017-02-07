const debug = require('debug')('lib-error-wrapper');
const { get } = require('lodash');

/**
 * Recursively pull out the nested error data
 */
function getErrorData(err) {
  if (!err.error) return err;
  return getErrorData(err.error);
}

/**
 * @param {Function} target - The function to wrap. Must return a promise. request-promise is expected.
 * @param {Object} options - (optional)
 * @param {Array} options.fields - The fields to pick from the original error object.
 */
function wrapper(target, options = {}) {
  return (...args) => {
    return target(...args)
      .catch((err) => {
        debug(err);
        if (!err.name || err.name !== 'StatusCodeError') throw err;

        const errorData = getErrorData(err);
        const error = Error(errorData.message || err.message);

        error.error = errorData;
        error.stack = err.stack;
        error.statusCode = err.statusCode;

        // Apply optional fields
        const { fields = [] } = options;
        fields.forEach(field => error[field] = get(err, field))

        throw error;
      });
  }
}

module.exports = wrapper;
