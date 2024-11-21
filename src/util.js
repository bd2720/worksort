/* utility functions */

// guess favicon url (https://example.com/xyz/... => https://example.com/favicon.ico)
export function getFavicon(url) {
  if(!url) return '#'
  // search for first '/' after '//'
  let offset = 0
  let shortUrl = url
  if (url.indexOf('http') === 0) {
    if (url[4] === 's') { // https
      shortUrl = url.slice(8)
      offset = 8
    } else { // http
      shortUrl = url.slice(7)
      offset = 7
    }
  }
  const slashIndex = shortUrl.indexOf('/')
  if (slashIndex === -1) {
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

// get today's date as 'yyyy-mm-dd'
export function getTodayStr(){
  return dateToStr(new Date())
}

// sort the array of jobs based on field value, ascending or descending
// this has to be done in JS since Dexie doesn't support WHERE + ORDER BY
export function sortJobs(jobs, field, descending){
  const mult = (descending) ? -1 : 1
  // sort by field
  switch (field){
    case 'title':
      return jobs.sort((a, b) => mult * a['title'].localeCompare(b['title']))
    case 'company':
      return jobs.sort((a, b) => mult * a['company'].localeCompare(b['company']))
    case 'date':
    default:
      return jobs.sort((a, b) => mult * (a['date'] - b['date']))
  }
}
// 'testword' => 'Testword'
export function capitalize(word){
  return word[0].toUpperCase() + word.slice(1)
}