var FetchError = require("./fetch_error")

module.exports = function(fetch) {
  return assign(function(url, opts) {
    var onResolve = errorifyResponse.bind(null, fetch, url, opts)
    var onReject = errorifyError.bind(null, fetch, url, opts)
    return fetch(url, opts).then(onResolve, onReject)
  }, fetch)
}

function errorifyResponse(fetch, url, opts, res) {
  if (res.status >= 400 && res.status < 600) {
    var Request = fetch.Request || global.Request

    throw new FetchError(res.status, res.statusText, {
      request: Request && new Request(url, opts),
      response: res
    })
  }
  else return res
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

function assign(target, source) {
  for (var key in source) target[key] = source[key]
  return target
}
