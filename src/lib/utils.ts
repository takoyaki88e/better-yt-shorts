import { EXCLUDED_KEY_BINDS, NUMBER_MODIFIERS } from "./declarations"
import { PolyDictionary } from "./definitions"

/**
 * Converts a formatted number to its full integer value.
 * @param {string} string value to be converted (eg: 1.4M, 1,291 or 727) 
 * @returns converted number
 */
export function convertLocaleNumber( string: string ): number | null
{
  if ( typeof string !== "string" ) return null
  
  const regex = /^([0-9\.,]+)\s?(\p{L}+)?/ui;
  const matches = string.match(regex)

	if (!matches) {
	  return 0
	}

  // 1 - number with point (now 1)
  // 4 - multiplier (eg: m, b, k) (now 2)

  let numericPart = matches[1];
  const multiplier = matches[2]?.toLowerCase();

  if ( multiplier )
  {
    // if has multiplier, comma is decimal point
    numericPart = matches[1].replace( /,/g, "." )
  }
  else
  {
    // remove separators
    numericPart = matches[1].replace( /\.,/g, "" )
  }

  const hasMultiplier = NUMBER_MODIFIERS?.hasOwnProperty( multiplier )

  if (hasMultiplier) {
    return Number(numericPart) * NUMBER_MODIFIERS![multiplier];
  } else {
    // Remove decimals and commas from the numeric part
    const numericValue = parseInt( numericPart, 10 )
    return numericValue;
  }
}

// todo  - fix types on this
export function wheel( element: HTMLElement, codeA: () => void, codeB: () => void ) {
  element.addEventListener( "wheel", ( e: WheelEvent ) => {
    e.preventDefault()

    if (e.deltaY < 0) codeA()
    else codeB()

    }, { passive: false }
  )
}

/**
 * Take an HTML string and convert it to a live HTML element.
 * 
 * This returns the element(s) themselves, and can be manipulated as such
 * 
 * The string must have a single parent (no siblings on the highest level, eg how react does it)
 * 
 * @param htmlString eg: "\<p class="myClass" id="myID"\>\</p\>"
 * @returns HTML Element (or null if the string parses to no HTML elements)
 */
export function render( htmlString: string ): Node
{
  const elements = new DOMParser().parseFromString( htmlString, "text/html" ).body.children

  if ( elements.length > 1 ) throw new Error( "ADSU | HTML String cannot have siblings!" )
  if ( elements.length < 1 ) throw new Error( "ADSU | HTML String must have an element!" )

  return elements[0] as Node
}

/**
 * returns a standard input element type depending on the given sample value
 * For example, `true` will return `"checkbox"`; `500` will return "number"
 */
export function determineInputType( sampleValue: any ): string
{
  switch( typeof sampleValue )
  {
    case "boolean":
      return "checkbox"
    case "number":
      return "number"
    case "string":
      return "text"

    default:
      return "text"
  }
}

export function getEnumEntries( givenEnum: any ): Array<[string, any]>
{
  return Object.entries( givenEnum as Object )
    .filter( ( ( [key, val] ) => isNaN( key as any ) ) )
}

/**
 * Assumes one word
 * @param str 
 * @returns 
 */
export function capitalise( str: string )
{
  return str[0].toUpperCase() + str.slice( 1 ).toLowerCase()
}


/**
 * Get enum value from key string, or return `default_return` if unfound
 */
export function getEnumWithString( givenEnum: any, key: string, default_return: any = null )
{
  return Object.assign( {}, givenEnum )[ key ] ?? default_return
}
/**
 * Get enum key from enum, or return `default_return` if unfound
 * note: this will return TO LOWER CASE!!
 */
export function getKeyFromEnum( givenEnum: any, value: any, default_return: any = null )
{
  return givenEnum[ value ].toLowerCase()
}