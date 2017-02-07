# lib-error-wrapper
A library to wrap other libraries that throw request-promise errors. Cleans up error output.

## Usage

```javascript
const errorWrapper = require('lib-error-wrapper');
const something = errorWrapper(require('something'));

something.action()
  .catch((err) => {
    // If error was a request-promise StatusCodeError, err will be a cleaned up version
  });
```

Will only transform errors with `name: 'StatusCodeError'`, all others will be thrown as received.

### options.fields

Wrap your target library passing `{ fields: ['name'] }` as options to include the `name` field from the original error on the transformed error:

```javascript
const something = errorWrapper(require('something'), { fields: ['name'] });
```

### options.raw

Use this options to skip all transformations and throw the error as it was received.
