import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import db from './db.js'

// insert a job into the database
// job object MUST NOT have an 'id' field yet
export function db_insert(job) {
  db.jobs.add(job)
  .then((retID) => console.log(`dbUtil.js: Job added successfully (id = ${retID})`))
  .catch((err) => console.error('dbUtil.js: Failed to add job -- ' + err))
}

// update an existing job in the database
// job must be passed in WITH 'id' FIELD
export function db_update(jobWithID) {
  db.jobs.put(jobWithID)
  .then((retID) => console.log(`dbUtil.js: Job edited successfully (id = ${retID})`))
  .catch((err) => console.error('dbUtil.js: Failed to edit job -- ' + err))
}

// delete a job from the database
// job 
export function db_delete(jobID) {
  db.jobs.delete(jobID)
  .then(() => console.log(`dbUtil.js: Job deleted successfully (id = ${jobID})`))
  .catch((err) => console.error('dbUtil.js: Failed to delete job -- ' + err))
}

// get entire array of jobs
export function db_query() {
  return useObservable(
    liveQuery(
      async () => {
        return await db.jobs.toArray()
      }
    )
  )
}