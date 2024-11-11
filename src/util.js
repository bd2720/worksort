/* utility functions */

// guess favicon url (https://example.com/xyz/... => https://example.com/favicon.ico)
export function getFavicon(url) {
  if(!url) return '#'
  // search for first '/' after '//'
  let offset = 0
  let shortUrl = url
  if (url.indexOf('http') == 0) {
    if (url[4] == 's') { // https
      shortUrl = url.slice(8)
      offset = 8
    } else { // http
      shortUrl = url.slice(7)
      offset = 7
    }
  }
  const slashIndex = shortUrl.indexOf('/')
  if (slashIndex == -1) {
    return url + '/favicon.ico'
  }
  return url.slice(0, offset + slashIndex) + '/favicon.ico'
}

// Date (Object) => yyyy-mm-dd
export function dateToStr(date) {
  if(!date.valueOf()) return ""
  return date.toISOString().split('T')[0]
}

// Date (Object) => mm/dd/yy
export function dateToShortStr(date) {
  if(!date.valueOf()) return ""
  const dateStr = dateToStr(date)
  const y = dateStr[2] + dateStr[3]
  const m = dateStr[5] + dateStr[6]
  const d = dateStr[8] + dateStr[9]
  return `${m}/${d}/${y}`
}