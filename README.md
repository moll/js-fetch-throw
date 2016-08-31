FetchThrow.js
=============
[![NPM version][npm-badge]](https://www.npmjs.com/package/fetch-throw)
[![Build status][travis-badge]](https://travis-ci.org/moll/js-fetch-throw)

FetchThrow.js is a mixin for the [Fetch API][fetch] for browsers and Node.js that rejects the returned promise with a [FetchError.js][fetch-error] instance should the network request fail or the response have a status of at least 400 and less than 600 (as defined for error responses in the HTTP specs).

[npm-badge]: https://img.shields.io/npm/v/fetch-throw.svg
[travis-badge]: https://travis-ci.org/moll/js-fetch-throw.png?branch=master
[fetch]: https://developer.mozilla.org/en/docs/Web/API/Fetch_API
[fetch-error]: https://github.com/moll/js-fetch-error


Installing
----------
```sh
npm install fetch-throw
```

FetchThrow.js follows [semantic versioning](http://semver.org), so feel free to depend on its major version with something like `>= 1.0.0 < 2` (a.k.a `^1.0.0`).

If you'd like more convenient access to the thrown `FetchError` instance (e.g. for `instanceof` checks), also install [`fetch-error`][fetch-error] and ensure there's only one installed:

```sh
npm install fetch-error
npm dedupe fetch-error
```


Using
-----
Wrap the native `fetch` function with the one from FetchThrow.js:

```javascript
var fetch = require("fetch-throw")(global.fetch)
```

Then call the returned function as you would with the regular Fetch API:

```javascript
var res = fetch("/models/42")
```

Should `/models` respond with 404, `res` will be rejected with an instance of [`FetchError`][fetch-error]. The `FetchError` property on `FetchThrow` is identical to doing `require("fetch-error")`.

```javascript
var FetchError = require("fetch-throw").FetchError

res.catch(function(err) {
  if (err instanceof FetchError) {
    var req = err.request
    console.error("%s %s failed: %s", req.method, req.url, err.message)
  }

  throw err
})
```

In case of unexpected errors (such as network name lookup failures) thrown by `fetch` before a request is made, `res` will also be rejected with an instance of `FetchError`. This allows you to identify failed requests for logging, for example, as shown above.

For a description of properties on the error, see below.

### Browser
Browsers have the Fetch API available at `window.fetch`:

```javascript
var fetch = require("fetch-throw")(window.fetch)
fetch("/models/42")
```

### Node.js
Node.js doesn't have a built-in implementation of the Fetch API, but you can use any library with a compatible interface, such as my [Fetch/Off.js][fetch-off] or [node-fetch][node-fetch]:

[fetch-off]: https://github.com/moll/node-fetch-off
[node-fetch]: https://github.com/bitinn/node-fetch

```javascript
var fetch = require("fetch-throw")(require("node-fetch"))
fetch("/models/42")
```

### Properties on an instance of FetchError

Property  | Description
----------|--------------------
code      | Response's `statusCode` or `0` in case of network error.
message   | Response's `statusText` or `"Network Error."`.
request   | A new Fetch API [`Request`][] object to help identify the request.
response  | The Fetch API [`Response`][] of the failed request.
error     | In case of non-response errors, it's set to the original error.

[`Response`]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[`Request`]: https://developer.mozilla.org/en-US/docs/Web/API/Request


License
-------
FetchThrow.js is released under a *Lesser GNU Affero General Public License*, which in summary means:

- You **can** use this program for **no cost**.
- You **can** use this program for **both personal and commercial reasons**.
- You **do not have to share your own program's code** which uses this program.
- You **have to share modifications** (e.g. bug-fixes) you've made to this program.

For more convoluted language, see the `LICENSE` file.


About
-----
**[Andri Möll][moll]** typed this and the code.  
[Monday Calendar][monday] supported the engineering work.

If you find FetchThrow.js needs improving, please don't hesitate to type to me now at [andri@dot.ee][email] or [create an issue online][issues].

[email]: mailto:andri@dot.ee
[issues]: https://github.com/moll/js-fetch-throw/issues
[moll]: http://themoll.com
[monday]: https://mondayapp.com
