//@ts-ignore
import GoogleMaps from "@google/maps"
import { Common } from "@/types"

export default class GoogleMapsClient {
  googleMapsClient: any
  constructor() {
    this.googleMapsClient = GoogleMaps.createClient({
      key: process.env.GOOGLE_MAPS_API_KEY,
      Promise,
    })
  }

  public async getGeocodeAddress(address: string = ""): Promise<Common.Geolocation | null> {
    try {
      if (!address) throw new Error("No address provided!")

      let response = await this.googleMapsClient.geocode({ address }).asPromise()

      let resultant = (response && response.json && response.json.results && response.json.results[0]) || null

      if (!resultant) throw new Error("No results returned by request!")

      let location =
        resultant.geometry && resultant.geometry.location
          ? {
              latitude: resultant.geometry.location.lat,
              longitude: resultant.geometry.location.lng,
            }
          : null

      if (!location) throw new Error("No results returned by request!")
      return location
    } catch (e) {
      return null
    }
  }

  // internal implementation of lat/long distance formula
  public static calculateDistanceInternal(x: Common.Geolocation, y: Common.Geolocation, unit: Common.Unit): number {
    if (x.latitude == y.latitude && x.longitude == y.longitude) {
      return 0
    } else {
      let radlat1 = (Math.PI * x.latitude) / 180
      let radlat2 = (Math.PI * y.latitude) / 180
      let theta = x.longitude - y.longitude
      let radtheta = (Math.PI * theta) / 180
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
      if (dist > 1) {
        dist = 1
      }
      dist = Math.acos(dist)
      dist = (dist * 180) / Math.PI

      // convert the distance to miles
      dist = dist * 60 * 1.1515

      if (unit == "km") dist = dist * 1.609344

      // round distance to the nearest hundreth
      return Math.round(100 * dist) / 100
    }
  }
}
