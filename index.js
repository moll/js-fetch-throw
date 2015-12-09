var FetchError = require("fetch-error")

exports = module.exports = function(fetch) {
  return assign(exports.fetch.bind(null, fetch), fetch)
}

exports.fetch = function(fetch, url, opts) {
  var onResolve = errorifyResponse.bind(null, fetch, url, opts)
  var onReject = errorifyError.bind(null, fetch, url, opts)
  return fetch(url, opts).then(onResolve, onReject)
}

function errorifyResponse(fetch, url, opts, res) {
  if (!isErrorResponse(res)) return res

  // https://fetch.spec.whatwg.org/#concept-network-error
  var Request = fetch.Request || global.Request
  var msg = res.status === 0 ? "Network Error" : res.statusText
  var props = {request: Request && new Request(url, opts), response: res}
  throw new FetchError(res.status, msg, props)
}

function errorifyError(fetch, url, opts, err) {
  if (err instanceof TypeError) {
    var Request = fetch.Request || global.Request

    throw new FetchError(0, err.message, {
      request: Request && new Request(url, opts),
      error: err
    })
  }
  else throw err
}

function isErrorResponse(res) {
  return res.type === "error" || res.status >= 400 && res.status < 600
}

function assign(target, source) {
  for (var key in source) target[key] = source[key]
  return target
}
