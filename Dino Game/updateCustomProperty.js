/**
 *
 * @param {elem} elem to get the prop from
 * @param {prop} prop to get
 * @returns string
 */
export function getCustomProperty(elem, prop) {
  //getCustomStyle - gets the specific css value
  //getCustomPropVal - gets the css prop
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

/**
 *
 * @param {elem} elem to set the prop of
 * @param {prop} prop
 * @param {value} value to change
 */
export function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

/**
 *
 * @param {elem} elem element to increment the property of
 * @param {prop} prop property to increment
 * @param {inc} inc value to increment
 */
export function incrementCustomProperty(elem, prop, inc) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
