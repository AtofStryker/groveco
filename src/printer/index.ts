import { Common } from "@/types"

export default function(
  store: Common.Store | null,
  distance: number | null,
  unit: Common.Unit = "mi",
  output: Common.Output = "text"
) {
  if (store && distance) {
    if (output == "text") {
      console.log(
        `Your closest store is ${store.name} located at ${store.location} approximately ${distance} ${unit} away. The address is ${store.address} ${store.city}, ${store.state} ${store.zip}`
      )
    } else {
      let printObj = {
        ...store,
        distance,
        unit,
      }
      console.log(JSON.stringify(printObj))
    }
  } else {
    let error =
      "Darn... You must live on Mars or something because I couldn't find a store for you! Did you enter a valid address?"
    if (output == "text") {
      console.log(error)
    } else {
      let printObj = {
        error,
      }
      console.log(JSON.stringify(printObj))
    }
  }
}
