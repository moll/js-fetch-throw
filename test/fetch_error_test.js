var FetchError = require("../fetch_error")

describe("FetchError", function() {
  describe("new", function() {
    it("must be an instance of FetchError", function() {
      new FetchError(404).must.be.an.instanceof(FetchError)
    })
  })
})
