// using Dexie, a wrapper for Indexed DB
import Dexie from 'dexie'

const db = new Dexie('jobData')
export default db

// create jobs, cats tables
db.version(1).stores({
  // id is (auto-incrementing) primary key
  jobs: '++id, title, company, date, catID',
  cats: '++id, &name',
})

// check db connection
db.open()
.then(() => {
  console.log('dbUtil.js: DB opened successfully.')
}).catch((err) => {
  console.error('dbUtil.js: Failed to open DB -- ' + err)
})