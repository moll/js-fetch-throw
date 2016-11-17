var FetchError = require("fetch-error")

exports = module.exports = function(fetch) {
  return assign(exports.fetch.bind(null, fetch), fetch)
}

exports.FetchError = FetchError

exports.fetch = function(fetch, url, opts) {
  var boundOnResponse = onResponse.bind(null, fetch, url, opts)
  var boundOnError = onError.bind(null, fetch, url, opts)
  return fetch(url, opts).then(boundOnResponse, boundOnError)
}

function onResponse(fetch, url, opts, res) {
  if (!isErrorResponse(res)) return res

  // https://fetch.spec.whatwg.org/#concept-network-error
  var msg = res.status === 0 ? "Network Error" : res.statusText

  // Creating a Request cannot fail at this point as the request wouldn't have
  // otherwise gone through.
  var Request = fetch.Request || global.Request
  var req = Request && new Request(url, opts)
  throw new FetchError(res.status, msg, {request: req, response: res})
}

function onError(fetch, url, opts, err) {
  var req
  var Request = fetch.Request || global.Request
  if (Request) try { req = new Request(url, opts) } catch (ex) { throw err }
  var props = {request: req, response: err.response, error: err}
  throw new FetchError(0, err.message, props)
}

function isErrorResponse(res) {
  return res.type === "error" || res.status >= 400 && res.status < 600
}

function assign(a, b) { for (var k in b) a[k] = b[k]; return a }
