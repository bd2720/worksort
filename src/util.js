/* utility functions */

// get favicon link using googleusercontent API
export function getFavicon(url, size){
  return `https://s2.googleusercontent.com/s2/favicons?sz=${size}&domain=${url}`
}

// Date (Object) => yyyy-mm-dd
export function dateToStr(date){
  if(!date.valueOf()) return ""
  return date.toISOString().split('T')[0]
}

// Date (Object) => mm/dd/yy
export function dateToShortStr(date){
  if(!date.valueOf()) return ""
  const dateStr = dateToStr(date)
  const y = dateStr[2] + dateStr[3]
  const m = dateStr[5] + dateStr[6]
  const d = dateStr[8] + dateStr[9]
  return `${m}/${d}/${y}`
}

// get today's date as 'yyyy-mm-dd'
export function getTodayStr(){
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${y}-${m}-${d}`
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

// test whether x is in [low, high], accounting for low/high being invalid
export function dateBetween(x, low, high){
  let inbounds = true;
  if(!isNaN(low.getTime())) inbounds &&= x >= low; // test lower bound
  if(!isNaN(high.getTime())) inbounds &&= x <= high; // test upper bound
  return inbounds;
}