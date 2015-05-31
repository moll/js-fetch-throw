var Sinon = require("sinon")
var HttpError = require("standard-http-error")
var FetchErrorify = require("root/lib/fetch/errorify")
var fetch = FetchErrorify(window.fetch)

describe("FetchErrorify", function() {
  beforeEach(function() {
    var xhr = window.XMLHttpRequest = Sinon.FakeXMLHttpRequest
    xhr.onCreate = Array.prototype.push.bind(this.requests = [])
  })

  it("must request", function*() {
    var res = fetch("/models", {method: "POST"})
    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")

    this.requests[0].respond(200, {}, "Hello")
    res = yield res
    res.status.must.equal(200)
    ;(yield res.text()).must.equal("Hello")
  })

  it("must reject with HttpError if 400 Bad Request", function*() {
    var res = fetch("/")
    this.requests[0].respond(400, {}, "")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.be.an.instanceof(HttpError)
    err.code.must.equal(400)
  })

  it("must reject with HttpError if 500 Internal Server Error", function*() {
    var res = fetch("/")
    this.requests[0].respond(500, {}, "")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.be.an.instanceof(HttpError)
    err.code.must.equal(500)
  })
})
