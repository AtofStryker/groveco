import getStores from "./index"

// mock the csv parsed input
const mockStore1: { [key: string]: number | string } = Object.freeze({
  "Store Name": "Kim K's... 'like', store",
  "Store Location": "Beverly Hills... That's where I wanna be!!",
  Address: "12345 Hollywood Boulevard",
  City: "Los Angeles",
  State: "CA",
  "Zip Code": 90210,
  County: "Testville",
  Latitude: 0,
  Longitude: 0,
})

jest.mock("./store-locations.csv", function() {
  return {
    "0": {
      ...mockStore1,
    },
  }
})

describe("Store Test Suite", () => {
  it("should get back formatted array stores that are more app friendly", async done => {
    // mock the csv file to include one store
    let stores = await getStores()
    expect(stores[0]).toBeTruthy()
    expect(stores[0].name).toEqual(mockStore1["Store Name"])
    expect(stores[0].location).toEqual(mockStore1["Store Location"])
    expect(stores[0].address).toEqual(mockStore1["Address"])
    expect(stores[0].city).toEqual(mockStore1["City"])
    expect(stores[0].state).toEqual(mockStore1["State"])
    expect(stores[0].zip).toEqual(mockStore1["Zip Code"])
    expect(stores[0].county).toEqual(mockStore1["County"])
    expect(stores[0].latitude).toEqual(mockStore1["Latitude"])
    expect(stores[0].longitude).toEqual(mockStore1["Longitude"])
    done()
  })
})
