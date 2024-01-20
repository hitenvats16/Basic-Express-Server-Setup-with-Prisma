/**
 * Takes Joi error object and turn it into error object with fixed format
 * @param {ErrorObject} obj 
 */
export function createErrorObject(obj) {
  return {
    name: obj.name,
    details: obj.details,
    message: obj.message,
  }
}
