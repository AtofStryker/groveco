import Main from "./index"
import { Common } from "@/types"
import * as CLI from "@/cli"
import * as getStores from "@/services/stores"
import * as printResults from "@/printer"

const defaultArgs: Array<string> = ["mock_node_path", "mock_bin_path"]
var argPayload: Common.Arguments | null = null
var stores: Common.Store[] | null = null
var geolocation: Common.Geolocation | null = null
var distance: number = 0

jest.mock("@/cli", function() {
  return jest.fn().mockImplementation(() => {
    return argPayload
  })
})
jest.mock("@/services/stores", function() {
  return jest.fn().mockImplementation(() => {
    return stores
  })
})
jest.mock("@/services/geolocation", function() {
  let classMock = jest.fn().mockImplementation(() => {
    return {
      getGeocodeAddress: jest.fn().mockResolvedValue(geolocation),
    }
  })
  // add a static method to the object. Does not fit the typings but will work for our needs
  //@ts-ignore
  classMock.calculateDistanceInternal = jest.fn().mockReturnValue(distance)
  return classMock
})
jest.mock("@/printer", function() {
  return jest.fn().mockImplementation()
})

describe("Main Test Suite", () => {
  beforeEach(() => {
    argPayload = null
    stores = null
    geolocation = null
    distance = 0
  })

  it("Fails gracefully if CLI arguments are null", async done => {
    const cliSpy = jest.spyOn(CLI, "default")
    await Main([...defaultArgs])
    expect(cliSpy).toHaveBeenCalled()
    done()
  })

  it("Fails gracefully if geolocation API fails", async done => {
    const cliSpy = jest.spyOn(CLI, "default")
    const storeSpy = jest.spyOn(getStores, "default")
    const printerSpy = jest.spyOn(printResults, "default")

    argPayload = {
      zip: "12345",
      address: null,
      unit: "mi",
      output: "text",
    }

    await Main([...defaultArgs])
    expect(cliSpy).toHaveBeenCalled()
    expect(storeSpy).not.toHaveBeenCalled()
    expect(printerSpy).toHaveBeenCalled()
    done()
  })

  it("Application executes as normal", async done => {
    const cliSpy = jest.spyOn(CLI, "default")
    const storeSpy = jest.spyOn(getStores, "default")
    const printerSpy = jest.spyOn(printResults, "default")

    argPayload = {
      zip: null,
      address: "2105 Woodsdale Drive Durham, Nc",
      unit: "km",
      output: "json",
    }

    stores = [
      {
        name: "Test Store 1",
        location: " location 1",
        address: "12345 someaddress road",
        city: "Gotham",
        state: "NY",
        zip: "12345",
        county: "Testville",
        latitude: 45,
        longitude: 90,
      },
      {
        name: "Test Store 2",
        location: " location 2",
        address: "67890 someaddress road",
        city: "Gotham",
        state: "NY",
        zip: "67890",
        county: "Testville",
        latitude: 50,
        longitude: 100,
      },
    ]

    geolocation = {
      longitude: 60,
      latitude: 70,
    }

    distance = 30

    await Main([...defaultArgs])
    expect(cliSpy).toHaveBeenCalled()
    expect(storeSpy).toHaveBeenCalled()
    expect(printerSpy).toHaveBeenCalled()
    done()
  })
})
