global.self = {}
try { require("whatwg-fetch"); module.exports = global.self.fetch }
finally { delete global.self }
