var FetchError = require("./fetch_error")

module.exports = function(fetch) {
  function fetchWithError(url, opts) {
    var onResolve = errorify.bind(null, fetch, url, opts)
    var onReject = onError.bind(null, fetch, url, opts)
    return fetch(url, opts).then(onResolve, onReject)
  }

  for (var key in fetch) fetchWithError[key] = fetch[key]

  return fetchWithError
}

function errorify(fetch, url, opts, res) {
  if (res.status >= 400 && res.status < 600) {
    var Request = fetch.Request || global.Request

    throw new FetchError(res.status, res.statusText, {
      request: Request && new Request(url, opts),
      response: res
    })
  }
  else return res
}

function onError(fetch, url, opts, err) {
  if (err instanceof TypeError) {
    var Request = fetch.Request || global.Request

    throw new FetchError(-1, err.message, {
      request: Request && new Request(url, opts),
      error: err
    })
  }
  else throw err
}
