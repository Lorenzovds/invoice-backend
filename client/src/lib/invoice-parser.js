import moment from 'moment'
import { reduce, includes, cloneDeep, map, forEach, every } from 'lodash'

const numericalEntries = ['amount', 'price', 'tax']
const dateKeysToParse = ['expireDate', 'invoiceDate']

/**
 * parse the incomming headers to a readable format,
 * mainly used for dates
 */
const parseHeadersIn = (headers) => {
  const headerCopy = cloneDeep(headers)

  return reduce(headerCopy, (acc, val, name) => {
    if (includes(dateKeysToParse, name)) acc[name] = moment.unix(val)
    return acc
  }, headerCopy)
}

/**
 * parse outgoing headers to a more machine friendly format,
 * reverse of what the incomming headers function did
 */
const parseHeadersOut = (headers) => {
  const headerCopy = cloneDeep(headers)
  return reduce(headerCopy, (acc, val, name) => {
    if (val instanceof moment) acc[name] = val.unix()
    return acc
  }, headerCopy)
}

/**
 * parse the outgoing entries
 */
const parseEntriesOut = (entries) => {
  return map(entries, entry => {
    const entryCopy = cloneDeep(entry)
    forEach(entry, (val, key) => {
      if (includes(numericalEntries, key)) entryCopy[key] = parseFloat(val, 10)
    })
    return entryCopy
  })
}

/**
 * validate all headers
 */
const validateHeaders = (headers) => {
  return every(headers, (val, key) => !!val)
}

const validateEntry = (entry) => {
  return every(entry, (val, key) => {
    if (!includes(numericalEntries, key)) return true
    return !isNaN(parseFloat(val, 10))
  })
}

export {
  parseHeadersIn,
  parseHeadersOut,
  parseEntriesOut,
  validateHeaders,
  validateEntry
}
