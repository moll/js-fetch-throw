var Sinon = require("sinon")
var Fetch = require("./fetch")
var FetchError = require("fetch-error")
var FetchErrorify = require("..")
var fetch = FetchErrorify(Fetch)

describe("ErrorifyFetch", function() {
  beforeEach(function() {
    var xhr = global.XMLHttpRequest = Sinon.FakeXMLHttpRequest
    xhr.onCreate = Array.prototype.push.bind(this.requests = [])
  })

  it("must return fetch with Headers, Request and Response", function() {
    fetch.Headers.must.equal(Fetch.Headers)
    fetch.Request.must.equal(Fetch.Request)
    fetch.Response.must.equal(Fetch.Response)
  })

  it("must request and resolve if 200 OK", function*() {
    var res = fetch("/models", {method: "POST"})
    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")

    this.requests[0].respond(200, {}, "Hello")
    res = yield res
    res.status.must.equal(200)
    ;(yield res.text()).must.equal("Hello")
  })

  it("must request and resolve if 303 See Other", function*() {
    var res = fetch("/models", {method: "POST"})
    this.requests[0].method.must.equal("POST")
    this.requests[0].url.must.equal("/models")

    this.requests[0].respond(303, {Location: "/models/1"})
    res = yield res
    res.status.must.equal(303)
    res.headers.get("location").must.equal("/models/1")
  })

  it("must reject with FetchError if 400 Bad Request", function*() {
    var res = fetch("/")
    this.requests[0].respond(400, {}, "")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.be.an.error(FetchError, "Bad Request")
    err.code.must.equal(400)
  })

  it("must reject with FetchError if 500 Internal Server Error", function*() {
    var res = fetch("/")
    this.requests[0].respond(500, {}, "")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.be.an.error(FetchError, "Internal Server Error")
    err.code.must.equal(500)
  })

  it("must assign response on FetchError if a non-OK response", function*() {
    var res = fetch("/nonexistent")
    this.requests[0].respond(404, {}, "Lost it. :(")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.have.nonenumerable("response")
    err.response.must.be.an.instanceof(Fetch.Response)
    err.response.status.must.equal(404)
  })

  it("must assign request on FetchError if a non-OK response", function*() {
    var res = fetch("/nonexistent", {headers: {"Accept": "application/vnd.x"}})
    this.requests[0].respond(404, {}, "Lost it. :(")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.have.nonenumerable("request")
    err.request.must.be.an.instanceof(Fetch.Request)
    err.request.url.must.equal("/nonexistent")
    err.request.headers.get("Accept").must.equal("application/vnd.x")
  })

  it("must reject with FetchError if network fails", function*() {
    var res = fetch("/nonexistent", {headers: {"Accept": "application/vnd.x"}})
    this.requests[0].respond(600, {}, "Lost it. :(")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.be.an.error(FetchError, "Network request failed")
    err.code.must.equal(0)
    err.must.have.enumerable("error")
    err.error.must.be.an.error(TypeError, "Network request failed")

    err.must.have.nonenumerable("request")
    err.must.not.have.property("response")

    err.request.must.be.an.instanceof(Fetch.Request)
    err.request.url.must.equal("/nonexistent")
    err.request.headers.get("Accept").must.equal("application/vnd.x")
  })

  it("must reject with FetchError if fetch rejects with syntax error",
    function*() {
    var fetchWithParse = FetchErrorify(function(url, opts) {
      return fetch(url, opts).then((res) => res.json())
    })

    var res = fetchWithParse("/nonexistent")
    var headers = {"Content-Type": "application/json"}
    this.requests[0].respond(200, headers, "{\"foo\": ")

    var err
    try { yield res } catch (ex) { err = ex }
    err.must.be.an.error(FetchError, "Unexpected end of input")
    err.code.must.equal(0)
    err.must.have.enumerable("error")
    err.error.must.be.an.error(SyntaxError, "Unexpected end of input")
  })
})
