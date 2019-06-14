# Coding challenge

Here is a solution to the grove.co coding challenge written in JavaScript/Typescript. The CLI uses a node.js binary executable to run the application from the command line.
The application will locate the nearest store, print the matching store address, as well as the distance to that store. The user needs to provide a zip or address, with units or output being optional. Please follow the instructions below to use the application.

```
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
```

### Prerequisites

- [nodejs >= 12.3.1](https://nodejs.org/)
- [npm >=6.9.0](https://www.npmjs.com/)
- [yarn >=1.16.0](https://github.com/yarnpkg/yarn)
- .env file or system variable with variable GOOGLE_MAPS_API_KEY set

### Setup

After cloning the repository and making sure all the prerequisites are installed, please run the following

```
yarn install
yarn build
yarn link
```

find_store should now be available in your command line. Give it a test!

```
Example
  find_store --address="1770 Union St, San Francisco, CA 94123"
  find_store --zip=94115 --units=km
```

### Testing

Each component is tested individually with Jest with a heavy enphasis on decoupling. Each test suite mocks its surrounding components to make sure responsibilities are clear.

```
 yarn test:unit
```

- The test coverage will be located in ./test/reports/coverage/icov-report/index.html
- The test results will be located in ./test/reports/unit/index.html
  Pop open the results in the browser (Google Chrome) to check them out!

### How it works

The app is made up 5 main components

- Main - orchestrates all of the below components
- CLI - parse command line arguments and populate defaults for application to consume
- Geolocation service - gets the lat/long of a given address and well as calculates the distance between two locations
- Store service - reads all the stores from store-locations.csv
- Printer - takes the results of the closest store and distance and prints them to the console

The application flows like the following:

1. Commands passed into the application will be sent to the CLI module. The CLI will check a multitude of things, mainly to validate the arguments passed to the application. If improper arguments are passed, the user will be informed and the application will not progress any further. When the proper arguments are passed, the CLI will return an `Arguments` type to give the application access to the zip, address, units, and output parameters (defaults and entered)
2. Next, the zip or address, whichever was entered, is passed into the Geolocation Service to try to lookup the latitude/longitude of the address. If none is found, the app fails gracefully and informs the user.
3. If a valid latitude/longitude is found, then it is possible to find which store is closest. The stores are then loaded from the .csv and parsed into an array of `Store` objects.
4. To find the closest store, we naivily iterate through the whole store list. Each iteration calculates the distance between the inputed address/zip latitude/longitude and the store's latitude/longitude. Whoever has the shortest distance is the closest store. The closest distance and store are saved into memory
5. The final results are then shown to the user. If a closest store and distance are found, they are shown to the user in the print format chosen. Otherwise, a default print is shown to indicate we could not find the closest store to the user. The default print could be used for a multitude of cases/errors

### Caveats

The application should handle most cases. The CLI as written today only takes 5 digit zip codes for the zip argument. This is a future improvement that can be further evaluated with a regular expression
