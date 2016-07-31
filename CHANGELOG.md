## 1.0.0 (Jul 31, 2016)
- Go and prosper!

## 0.3.2 (Dec 11, 2015)
- Sets `response` on `FetchError` if `fetch` rejects with an error that has it
  set.  
  That's useful if middleware before FetchThrow.js tried to parse the JSON
  response, but threw a `SyntaxError`.

## 0.3.1 (Dec 10, 2015)
- Fixes throwing a `FetchError` if creating a [`Request`][] itself throws.

## 0.3.0 (Dec 10, 2015)
- Renames to `FetchThrow`.
- Rejects all errors with `FetchError`.

## 0.2.0 (Dec 9, 2015)
- Rejects with `FetchError` instead of `HttpError`.
- Adds the `request` property (an instance of [`Request`][]) with details of the
  request to the error.
- Rejects with `FetchError` also for network errors.
- Returns a new `fetch` function with all enumerable properties carried over.  
  Handy if the given `fetch` function contains the otherwise global `Headers`,
  `Request` and `Response` objects.
- Exports the throwing fetch function.

[`Request`]: https://developer.mozilla.org/en-US/docs/Web/API/Request

## 0.1.337 (Aug 14, 2015)
- Scoped release for personal use and profit.
