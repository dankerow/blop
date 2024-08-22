/**
 * Trims an array to a given maximum length and appends a message indicating how many more elements are not shown.
 *
 * @param {Array} array - The array to be trimmed.
 * @param {number} [maxLength=10] - The maximum length of the trimmed array.
 * @return {Array} - The trimmed array with a message indicating how many more elements are not shown.
 */
export default (array: any[], maxLength: number = 10): any[] => {
  if (array.length > maxLength) {
    const length = array.length - maxLength
    array = array.slice(0, maxLength)
    array.push(`and ${length} more...`)
  }

  return array
}
