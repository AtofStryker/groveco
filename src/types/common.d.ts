/**
 * Types of distance units supported by app, can be 'mi' or 'km'
 * These stance for miles of kilometers
 *
 * @export
 * @type {Unit}
 */
export type Unit = "mi" | "km"

/**
 * Types of distance units supported by app
 *
 * @export
 * @type {Output}
 */
export type Output = "text" | "json"

/**
 * Types of distance units supported by app, can be 'text' or 'json'
 *
 * @export
 * @interface {Geolocation}
 */
export interface Geolocation {
  latitude: number
  longitude: number
}

/**
 *  Type to represent our store object
 *
 * @export
 * @interface {Store}
 * @extends {Geolocation}
 */
export interface Store extends Geolocation {
  name: string
  location: string
  address: string
  city: string
  state: string
  zip: string
  county: string
}

/**
 * Representation of parsed arguments passed into the application
 *
 * @export
 * @interface {Arguments}
 */
export interface Arguments {
  zip: string | null
  address: string | null
  unit: Unit
  output: Output
}
