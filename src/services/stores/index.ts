import { Common } from "@/types"
var stores: Common.Store[] | null = null

export default async function(): Promise<Common.Store[]> {
  try {
    // load stores into memory if not done so already
    if (!stores) {
      //@ts-ignore
      const CSV = await import("./store-locations.csv")
      stores = Object.keys(CSV).map((index: string) => {
        let storeItem = CSV[index]
        return {
          name: storeItem["Store Name"],
          location: storeItem["Store Location"],
          address: storeItem["Address"],
          city: storeItem["City"],
          state: storeItem["State"],
          zip: storeItem["Zip Code"],
          latitude: storeItem["Latitude"],
          longitude: storeItem["Longitude"],
          county: storeItem["County"],
        } as Common.Store
      })

      // get rid of any invalid store values from the csv
      stores = stores.filter(store => {
        return typeof store.latitude === "number" && typeof store.latitude === "number"
      })
    }
    return stores as Common.Store[]
  } catch (e) {
    return []
  }
}
