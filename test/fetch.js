global.self = {}
try { require("whatwg-fetch"); module.exports = global.self.fetch }
finally { delete global.self }

// Cannot reload the polyfill as it mutates world state and doesn't return
// exports.
require("require-guard")()
