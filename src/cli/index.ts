import arg from "arg"
import { Common } from "@/types"

const unitOptions = ["mi", "km"]
const outputOptions = ["text", "json"]
const doc = `
Usage:
  find_store --address="<address>"
  find_store --address="<address>" [--units=(mi|km)] [--output=text|json]
  find_store --zip=<zip>
  find_store --zip=<zip> [--units=(mi|km)] [--output=text|json]

Options:
  --zip=<zip>            Find nearest store to this zip code. If there are multiple best-matches, return the first.
  --address="<address>"  Find nearest store to this address. If there are multiple best-matches, return the first.
  --units=(mi|km)        Display units in miles or kilometers [default: mi]
  --output=(text|json)   Output in human-readable text, or in JSON (e.g. machine-readable) [default: text]

Example
  find_store --address="1770 Union St, San Francisco, CA 94123"
  find_store --zip=94115 --units=km
`
function parseArgs(rawArgs: any): Common.Arguments | null {
  const args = arg(
    {
      "--zip": String,
      "--address": String,
      "--units": String,
      "--output": String,
      "--help": Boolean,
      "-z": "--zip",
      "-a": "--address",
      "-u": "--units",
      "-o": "--output",
      "-h": "--help",
    },
    {
      argv: rawArgs.slice(2),
    }
  )

  let zip = args["--zip"] || null
  let address = args["--address"] || null
  let help = args["--help"] ? true : false

  if (help) return null
  if (args && Object.keys(args).length == 1) return null
  if (!zip && !address) throw new Error("Please provide a zip or an address")
  if (zip && zip.length !== 5) throw new Error("Please provide a valid zip code")

  let unit = args["--units"] && unitOptions.includes(args["--units"]) ? args["--units"] : unitOptions[0]
  let output = args["--output"] && outputOptions.includes(args["--output"]) ? args["--output"] : outputOptions[0]

  return {
    zip,
    address,
    unit,
    output,
  } as Common.Arguments
}

export default function(args: any): Common.Arguments | null {
  var options = null
  try {
    options = parseArgs(args)
  } catch (ex) {
    console.log(ex.message)
  } finally {
    if (!options) console.log(doc)
    return options
  }
}
