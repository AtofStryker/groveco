import CLI from "./index"
import { Common } from "@/types"

const defaultArgs: Array<string> = ["mock_node_path", "mock_bin_path"]
const defaultUnit: Common.Unit = "mi"
const altUnit: Common.Unit = "km"
const defaultOutput: Common.Output = "text"
const altOutput: Common.Output = "json"
const optdoc = `
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

describe("CLI Test Suite", () => {
  it("should parse arguments and populate defaults", () => {
    const zip = "90210"
    const testArgs: Array<string> = [...defaultArgs, `--zip=${zip}`]
    let parsedArgs = CLI(testArgs)
    if (!parsedArgs) throw new Error("ParsedArgs should not be null.")
    expect(parsedArgs.address).toBeNull()
    expect(parsedArgs.zip).toEqual(zip)
    expect(parsedArgs.unit).toEqual(defaultUnit)
    expect(parsedArgs.output).toEqual(defaultOutput)
  })

  describe("Unit Options", () => {
    it("should default to measurement unit of `mi` if invalid argument is passed", () => {
      const zip = "27703"
      const badUnit = "parsecs"
      const testArgs: Array<string> = [...defaultArgs, `--zip=${zip}`, `--units=${badUnit}`]
      let parsedArgs = CLI(testArgs)
      if (!parsedArgs) throw new Error("ParsedArgs should not be null.")
      expect(parsedArgs.address).toBeNull()
      expect(parsedArgs.zip).toEqual(zip)
      expect(parsedArgs.unit).toEqual(defaultUnit)
      expect(parsedArgs.output).toEqual(defaultOutput)
    })

    it("should provide measurement unit 'km' if passed in", () => {
      const address = "57 Waldron Avenue Glen Rock, NJ"
      const testArgs: Array<string> = [...defaultArgs, `--address=${address}`, `--units=${altUnit}`]
      let parsedArgs = CLI(testArgs)
      if (!parsedArgs) throw new Error("ParsedArgs should not be null.")
      expect(parsedArgs.zip).toBeNull()
      expect(parsedArgs.address).toEqual(address)
      expect(parsedArgs.unit).toEqual(altUnit)
      expect(parsedArgs.output).toEqual(defaultOutput)
    })
  })

  describe("Output Options", () => {
    it("should default to output `text` if invalid argument is passed", () => {
      const address = "2105 Woodsdale Drive Durham, NC 27703"
      const badOutput = "video"
      const testArgs: Array<string> = [...defaultArgs, `--address=${address}`, `--output=${badOutput}`]
      let parsedArgs = CLI(testArgs)
      if (!parsedArgs) throw new Error("ParsedArgs should not be null.")
      expect(parsedArgs.zip).toBeNull()
      expect(parsedArgs.address).toEqual(address)
      expect(parsedArgs.unit).toEqual(defaultUnit)
      expect(parsedArgs.output).toEqual(defaultOutput)
    })

    it("should provide output 'json' if passed in", () => {
      const zip = "07452"
      const testArgs: Array<string> = [...defaultArgs, `--zip=${zip}`, `--output=${altOutput}`]
      let parsedArgs = CLI(testArgs)
      if (!parsedArgs) throw new Error("ParsedArgs should not be null.")
      expect(parsedArgs.address).toBeNull()
      expect(parsedArgs.zip).toEqual(zip)
      expect(parsedArgs.unit).toEqual(defaultUnit)
      expect(parsedArgs.output).toEqual(altOutput)
    })
  })

  it("should show help when no arguments are passed", () => {
    const testArgs: Array<string> = [...defaultArgs]

    let spy = jest.spyOn(console, "log")
    let parsedArgs = CLI(testArgs)
    expect(parsedArgs).toBeNull()

    expect(spy).toBeCalledWith(expect.stringContaining(optdoc))
  })

  it("should show help when --help argument is passed", () => {
    const testArgs: Array<string> = [...defaultArgs, "--help"]

    let spy = jest.spyOn(console, "log")
    let parsedArgs = CLI(testArgs)
    expect(parsedArgs).toBeNull()

    expect(spy).toBeCalledWith(expect.stringContaining(optdoc))
  })

  it("should throw error arguments for --address and --zip are missing", () => {
    const testArgs: Array<string> = [...defaultArgs, `--units=${defaultUnit}`]
    const missingZipAndAddressText = "Please provide a zip or an address"
    let spy = jest.spyOn(console, "log")
    let parsedArgs = CLI(testArgs)
    expect(parsedArgs).toBeNull()

    expect(spy).toBeCalledWith(expect.stringContaining(missingZipAndAddressText))
  })

  it("should throw error arguments for --zip if zip is provided but is not 5 digits", () => {
    const zip = "1234567"
    const testArgs: Array<string> = [...defaultArgs, `--zip=${zip}`]
    const zipCodeIncorrectFormat = "Please provide a valid zip code"
    let spy = jest.spyOn(console, "log")
    let parsedArgs = CLI(testArgs)
    expect(parsedArgs).toBeNull()

    expect(spy).toBeCalledWith(expect.stringContaining(zipCodeIncorrectFormat))
  })
})
