import GeolocationClient from "./index"
import { Common } from "@/types"

//WWE Smackdown Headquarters, because why not continue the crazy!
const testAddress = "1241 East Main Street Stamford, CT 06902"
const testReallyBadAddress = "I'm not even an address, dude"
const testBadAddress = "12345 CatDog Lane"
const defaultUnit: Common.Unit = "mi"
const altUnit: Common.Unit = "km"

const mockGeoLocation1: Common.Geolocation = Object.freeze({
  latitude: 0,
  longitude: 0,
})

const mockGeoLocation2: Common.Geolocation = Object.freeze({
  latitude: 45,
  longitude: 90,
})

jest.mock("@google/maps", function() {
  return {
    createClient(...args: any) {
      return {
        geocode(options: { [key: string]: any } = {}) {
          return {
            asPromise() {
              return new Promise((resolve, reject) => {
                if (options.address) {
                  var response = null
                  if (options.address == testReallyBadAddress) {
                    // this address just ain't no good. The API didnt fail but the response body is null
                    response = {
                      json: {
                        results: null,
                      },
                    }
                  } else if (options.address == testBadAddress) {
                    // we found the address, but it doesnt have a lat long for some reason or another
                    response = {
                      json: {
                        results: [
                          {
                            geometry: {
                              location: null,
                            },
                          },
                        ],
                      },
                    }
                  } else {
                    response = {
                      json: {
                        results: [
                          {
                            geometry: {
                              location: {
                                lat: mockGeoLocation1.latitude,
                                lng: mockGeoLocation1.longitude,
                              },
                            },
                          },
                        ],
                      },
                    }
                  }
                  resolve(response)
                } else {
                  reject()
                }
              })
            },
          }
        },
      }
    },
  }
})

describe("Geolocation Test Suite", () => {
  describe("Test getGeocodeAddress Function", () => {
    it("should return null if no address is provided", async done => {
      let testClient = new GeolocationClient()
      let response = await testClient.getGeocodeAddress()
      expect(response).toBeNull()
      done()
    })

    it("should return a lat/long if a valid address is provided", async done => {
      let testClient = new GeolocationClient()
      let response = await testClient.getGeocodeAddress(testAddress)
      expect(response).toEqual(mockGeoLocation1)
      done()
    })

    describe("should return null if an invalid address is provided", () => {
      it("fails when api call succeeds but no data was found", async done => {
        let testClient = new GeolocationClient()
        let response = await testClient.getGeocodeAddress(testReallyBadAddress)
        expect(response).toBeNull()
        done()
      })

      it("fails when api call succeeds and data is found, but no lat/long is provided", async done => {
        let testClient = new GeolocationClient()
        let response = await testClient.getGeocodeAddress(testBadAddress)
        expect(response).toBeNull()
        done()
      })
    })
  })

  describe("Test calculateDistanceInternal Function", () => {
    let distanceInMiles = 0
    it("Returns the distance between two lat/longs when information is provided", () => {
      distanceInMiles = GeolocationClient.calculateDistanceInternal(mockGeoLocation1, mockGeoLocation2, defaultUnit)
      expect(distanceInMiles).not.toBeNaN()
    })

    it("Returns the distance in kilometers when requested", () => {
      let distance = GeolocationClient.calculateDistanceInternal(mockGeoLocation1, mockGeoLocation2, altUnit)
      expect(distance).not.toBeNaN()
      expect(distance).toBeGreaterThan(distanceInMiles)
    })

    it("Returns Zero when the same point is passed in twice", () => {
      distanceInMiles = GeolocationClient.calculateDistanceInternal(mockGeoLocation1, mockGeoLocation1, defaultUnit)
      expect(distanceInMiles).toEqual(0)
    })
  })
})
