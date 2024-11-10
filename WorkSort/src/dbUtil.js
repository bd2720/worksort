import { liveQuery } from 'dexie'
import { useObservable } from '@vueuse/rxjs'
import db from './db.js'

/* JOBS */

// insert a job into the database
// job object MUST NOT have an 'id' field yet
export function db_jobs_insert(job) {
  db.jobs.add(job)
  .then((retID) => console.log(`dbUtil.js: Job added successfully (id = ${retID})`))
  .catch((err) => console.error('dbUtil.js: Failed to add job -- ' + err))
}

// update an existing job in the database
// job must be passed in WITH 'id' FIELD
export function db_jobs_update(jobWithID) {
  db.jobs.put(jobWithID)
  .then((retID) => console.log(`dbUtil.js: Job edited successfully (id = ${retID})`))
  .catch((err) => console.error('dbUtil.js: Failed to edit job -- ' + err))
}

// delete job with the given ID from the database
export function db_jobs_delete(jobID) {
  db.jobs.delete(jobID)
  .then(() => console.log(`dbUtil.js: Job deleted successfully (id = ${jobID})`))
  .catch((err) => console.error('dbUtil.js: Failed to delete job -- ' + err))
}

// get array of jobs by category
export function db_jobs_query(catID) {
  // must pass category as a ref, so query updates with category
  return useObservable(
    liveQuery(async () => {
      console.log(`dbUtil.js: Job query triggered (catID = ${catID})`);
      return await db.jobs
        .where('catID').equals(catID)
        .toArray()
    })
  )
}

/* CATEGORIES (TABLES) */

export function db_cats_insert(cat) {
  db.cats.add(cat)
  .then((retID) => console.log(`dbUtil.js: Category added successfully (id = ${retID})`))
  .catch((err) => console.error('dbUtil.js: Failed to add category -- ' + err))
}

export function db_cats_update(catWithID) {
  db.cats.put(catWithID)
  .then((retID) => console.log(`dbUtil.js: Category edited successfully (id = ${retID})`))
  .catch((err) => console.error('dbUtil.js: Failed to edit category -- ' + err))
}

export function db_cats_delete(catID) {
  db.cats.delete(catID)
  .then(() => console.log(`dbUtil.js: Category deleted successfully (id = ${catID})`))
  .catch((err) => console.error('dbUtil.js: Failed to delete category -- ' + err))
}

export function db_cats_query() {
  return useObservable(
    liveQuery(
      async () => {
        console.log(`dbUtil.js: Category query triggered`);
        return await db.cats
        .toArray()
      }
    )
  )
}