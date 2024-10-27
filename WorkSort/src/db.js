// using Dexie, a wrapper for Indexed DB
import Dexie from 'dexie'

export const db = new Dexie('jobData')

// create jobs table
db.version(1).stores({
  // id is (unique) primary key
  jobs: '++id, title, company, date',
  // store for metadata (nextID)
  meta: '&key'
})

// initialize nextID
db.meta.put({
  key: 'nextID',
  value: 1
}).catch((error) => {
  // nextID already exists
})
