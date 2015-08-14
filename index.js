var HttpError = require("standard-http-error")

module.exports = Function.bind.bind(function(fetch, url, opts) {
  return fetch(url, opts).then(errorify)
}, null)

function errorify(res) {
  if (res.status >= 400 && res.status < 600)
    throw new HttpError(res.status, res.statusText, {response: res})
  else
    return res
}
