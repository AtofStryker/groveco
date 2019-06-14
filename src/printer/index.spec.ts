import printer from "./index"
import { Common } from "@/types"

const mockStore: Common.Store = Object.freeze({
  name: "Kim K's... 'like', store",
  location: "Beverly Hills... That's where I wanna be!!",
  address: "12345 Hollywood Boulevard",
  city: "Los Angeles",
  state: "CA",
  zip: "90210",
  county: "Testville",
  latitude: 0,
  longitude: 0,
})

const mockDistance: number = 5
const defaultUnit: Common.Unit = "mi"
const altUnit: Common.Unit = "km"
const altOutput: Common.Output = "json"

describe("Printer Test Suite", () => {
  describe("Store/Distance not found", () => {
    it("should print default as text", () => {
      let store = null
      let distance = null

      let spy = jest.spyOn(console, "log")
      printer(store, distance)

      expect(spy).toBeCalledWith(
        expect.stringContaining(
          `Darn... You must live on Mars or something because I couldn't find a store for you! Did you enter a valid address?`
        )
      )
    })

    it("should print default as json when output passed in is `json`", () => {
      let store = null
      let distance = null

      let spy = jest.spyOn(console, "log")
      printer(store, distance, defaultUnit, altOutput)

      expect(spy).toBeCalledWith(
        expect.stringContaining(
          `{"error":"Darn... You must live on Mars or something because I couldn't find a store for you! Did you enter a valid address?"}`
        )
      )
    })
  })

  it("should default to text print", () => {
    let spy = jest.spyOn(console, "log")
    printer(mockStore, mockDistance)

    expect(spy).toBeCalledWith(
      expect.stringContaining(
        `Your closest store is ${mockStore.name} located at ${mockStore.location} approximately ${mockDistance} ${defaultUnit} away. The address is ${mockStore.address} ${mockStore.city}, ${mockStore.state} ${mockStore.zip}`
      )
    )
  })

  it("should print json when output type json is provided", () => {
    let spy = jest.spyOn(console, "log")
    printer(mockStore, mockDistance, defaultUnit, altOutput)

    let printObj = {
      ...mockStore,
      distance: mockDistance,
      unit: defaultUnit,
    }

    expect(spy).toBeCalledWith(expect.stringContaining(JSON.stringify(printObj)))
  })

  it("should default to unit mi", () => {
    let spy = jest.spyOn(console, "log")
    printer(mockStore, mockDistance)
    expect(spy).toBeCalledWith(expect.stringContaining(defaultUnit))
  })

  it("should print distance in km when km unit is provided, regardless of conversion", () => {
    let spy = jest.spyOn(console, "log")
    printer(mockStore, mockDistance, altUnit)
    expect(spy).toBeCalledWith(expect.stringContaining(altUnit))
  })
})
