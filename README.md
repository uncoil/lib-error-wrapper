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

## Updating this NPM package

1. Commit changes and merge to `master`.
2. Update the `CHANGELOG.md` with version number and notes on changes since the last version.
3. Make sure you are logged in to npm on the CLI: `npm login`.
4. Run `npm version <update_type>`.
    - `update_type` is one of the semantic versioning release types: "patch","minor", or "major".
    - This will update the `package.json` and tag the git repo.
5. Commit and push versioning update and tags.
6. Run `npm publish`.
7. Visit https://www.npmjs.com/package/eslint-config-strawhouse and ensure the correct version is displayed.

### Futher reading:
**NPM docs: Updating the package** - https://docs.npmjs.com/getting-started/publishing-npm-packages#updating-the-package
