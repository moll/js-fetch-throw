var FetchError = require("fetch-error")

exports = module.exports = function(fetch) {
  return assign(exports.fetch.bind(null, fetch), fetch)
}

exports.fetch = function(fetch, url, opts) {
  var onResponse = exports.onResponse.bind(null, fetch, url, opts)
  var onError = exports.onError.bind(null, fetch, url, opts)
  return fetch(url, opts).then(onResponse, onError)
}

exports.onResponse = function(fetch, url, opts, res) {
  if (!isErrorResponse(res)) return res

  // https://fetch.spec.whatwg.org/#concept-network-error
  var Request = fetch.Request || global.Request
  var msg = res.status === 0 ? "Network Error" : res.statusText

  throw new FetchError(res.status, msg, {
    request: Request && new Request(url, opts), response: res
  })
}

exports.onError = function(fetch, url, opts, err) {
  var Request = fetch.Request || global.Request

  throw new FetchError(0, err.message, {
    request: Request && new Request(url, opts),
    error: err
  })
}

function isErrorResponse(res) {
  return res.type === "error" || res.status >= 400 && res.status < 600
}

function assign(target, source) {
  for (var key in source) target[key] = source[key]
  return target
}
