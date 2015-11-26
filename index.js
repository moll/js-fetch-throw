var FetchError = require("./fetch_error")

module.exports = Function.bind.bind(function(fetch, url, opts) {
  return fetch(url, opts).then(errorify.bind(null, fetch, url, opts))
}, null)

function errorify(fetch, url, opts, res) {
  if (res.status >= 400 && res.status < 600) {
    var Request = fetch.Request || global.Request
    var props = {request: Request && new Request(url, opts), response: res}
    throw new FetchError(res.status, res.statusText, props)
  }
  else return res
}
