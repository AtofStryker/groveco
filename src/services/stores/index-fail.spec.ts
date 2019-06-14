import getStores from "./index"

jest.mock("./store-locations.csv", function() {
  throw new Error("MY FILE EXPLODED!")
})

describe("Store Test Suite Failure", () => {
  it("Should return an empty array when an error arises", async done => {
    expect(await getStores()).toEqual([])
    done()
  })
})
