var HttpError = require("standard-http-error")
module.exports = FetchError
var NON_ENUM = {enumerable: false}

function FetchError(code, msg, opts) {
  HttpError.call(this, code, msg, opts)

  // Hide the whole whopping req/res objects from any error handler that might
  // enumerate and serialize the whole error.
  if ("request" in this) Object.defineProperty(this, "request", NON_ENUM)
  if ("response" in this) Object.defineProperty(this, "response", NON_ENUM)
}

FetchError.prototype = Object.create(Error.prototype, {
  constructor: {value: FetchError, configurable: true, writable: true}
})

// Set name explicitly for when the code gets minified.
FetchError.prototype.name = "FetchError"

FetchError.prototype.toString = function() {
  return this.name + ": " + this.code + " " + this.message
}
