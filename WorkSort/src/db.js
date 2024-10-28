// using Dexie, a wrapper for Indexed DB
import Dexie from 'dexie'

const db = new Dexie('jobData')
export default db

// create jobs table
db.version(1).stores({
  // id is (auto-incrementing) primary key
  jobs: '++id, title, company, date',
})

db.open()
.then((msg) => {
  console.log('dbUtil.js: DB opened successfully --' + msg)
}).catch((err) => {
  console.error('dbUtil.js: Failed to open DB -- ' + err)
})