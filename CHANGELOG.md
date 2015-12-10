## Unreleased
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
