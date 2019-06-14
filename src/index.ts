import CLI from "@/cli"
import getStores from "@/services/stores"
import GeolocationClient from "@/services/geolocation"
import printResults from "@/printer"

export default async function(args: any) {
  let options = CLI(args)
  if (!options) return

  // set address to address or zip, depending on what was passed in. this is to make typescript happy!
  var address
  if (options.address) {
    address = options.address
  } else if (options.zip) {
    address = options.zip
  } else {
    return
  }

  let client = new GeolocationClient()
  let geolocation = await client.getGeocodeAddress(address)

  var closestStore: any = null
  var distanceToStore: any = null

  if (geolocation) {
    let stores = await getStores()
    stores.forEach(store => {
      //@ts-ignore
      let distance = GeolocationClient.calculateDistanceInternal(geolocation, store, options!.unit)
      if (distanceToStore === null || distance <= distanceToStore) {
        distanceToStore = distance
        closestStore = store
      }
    })
  }

  printResults(closestStore, distanceToStore, options.unit, options.output)
}
