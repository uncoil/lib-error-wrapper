# lib-error-wrapper
A library to wrap other libraries that throw request-promise errors. Cleans up error output.

## Usage

```
const errorWrapper = require('lib-error-wrapper');
const something = errorWrapper(require('something'));

something.action()
  .catch((err) => {
    // If error was a request-promise StatusCodeError, err will be a cleaned up version
  });
```javascript

Will only transform errors with `name: 'StatusCodeError'`, all others will be thrown as received.

### options.fields

Wrap your target library passing `{ fields: ['name'] }`javascript as options to include the `name` field from the original error on the transformed error:

```
const something = errorWrapper(require('something'), { fields: ['name'] });
```javascript

### options.raw

Use this options to skip all transformations and throw the error as it was received.
