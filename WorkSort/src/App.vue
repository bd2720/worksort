<script setup>
import { ref, computed } from 'vue'
// JSON array of job objects
const jobs = ref([])
// begin jobIDs at 1
const nextID = ref(1)

// input variables
const tempTitle = ref("")
const tempCompany = ref("")
const tempDate = ref("")
const tempURL = ref("")
// clear fields
function clearInputs() {
  tempTitle.value = ""
  tempCompany.value = ""
  tempDate.value = ""
  tempURL.value = ""
}

// show input fields if adding jobs or editing a specific job
const showInputs = computed(() => {
  return addingJobs.value || selectedJobID.value
})

// show functional buttons (Add, Edit, Delete)
const showFunctions = computed(() => {
  return !addingJobs.value && !editingJobs.value && !deletingJobs.value
})

const addingJobs = ref(false)
function startNewJob() {
  clearInputs()
  addingJobs.value = true
}

const editingJobs = ref(false)
function startEditJob() {
  editingJobs.value = true
}

const deletingJobs = ref(false)
function startDeleteJob() {
  deletingJobs.value = true
}

// computes which jobs are currently displayed
const jobsDisplayed = computed(() => {
  return jobs.value
})

// add filled-out job object to jobs
function finalizeNewJob() {
  // add new job object
  jobs.value.push({
    id: nextID.value++,
    title: tempTitle.value,
    company: tempCompany.value,
    date: tempDate.value,
    url: tempURL.value,
  })
  // sort new list
  sortJobs()
  // no longer adding jobs
  addingJobs.value = false
}

function abortNewJob() {
  addingJobs.value = false
}

// needed for storing selected job while editing; null means unselected
const selectedJobID = ref(null)
// reference to the selected job object
const selectedJob = computed(() => {
  if (!selectedJobID.value) return null
  // sequentially search for job object in jobs array
  for (const job of jobs.value) {
    if (job['id'] == selectedJobID.value) {
      return job
    }
  }
  return null
})
// begin editing job information
function selectJob(jobID) {
  // save the selected job id
  selectedJobID.value = jobID
  // init. fields with specified job information
  tempTitle.value = selectedJob.value['title']
  tempCompany.value = selectedJob.value['company']
  tempDate.value = selectedJob.value['date']
  tempURL.value = selectedJob.value['url']
}

function editJob() {
  // save new information to the currently selected job
  selectedJob.value['title'] = tempTitle.value
  selectedJob.value['company'] = tempCompany.value
  selectedJob.value['date'] = tempDate.value
  selectedJob.value['url'] = tempURL.value
  // sort updated list
  sortJobs()
  // deselect the job after updating list
  selectedJobID.value = null
}

// when "Cancel" is pressed while editing a specific job
function deselectJob() {
  selectedJobID.value = null
}

// exit editing mode
function finalizeEditJob() {
  editingJobs.value = false
}

// delete the job associated with the given jobID
function deleteJob(jobID) {
  // remove job with matching ID
  jobs.value = jobs.value.filter((job) => job['id'] != jobID)
}

// exit deletingJobs mode
function finalizeDeleteJob() {
  deletingJobs.value = false
}

const showExtraJobButtons = computed(() => {
  return (editingJobs.value && !selectedJobID.value) || deletingJobs.value
})
// adds the "tr-extended" class to the table, adding an extra column for Edit/Delete buttons
const tableClass = computed(() => {
  return showExtraJobButtons.value ? "tr-extended" : ""
})

// function by which to sort jobs
var activeSort = jobComp_earliest
function sortJobs(){
  jobs.value.sort(activeSort)
}

// comparator for sorting job objects by ascending date
function jobComp_earliest(a, b){
  const dA = new Date(a['date'])
  const dB = new Date(b['date'])
  if(dA < dB){
    return -1
  } else if(dA > dB){
    return 1
  }
  return 0
}

// guess favicon url (https://example.com/xyz/... => https://example.com/favicon.ico)
function getFavicon(url) {
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

</script>

<template>
  <header>
    <h1>WorkSort</h1>
    <p class="subtitle">Organize your job applications</p>
  </header>
  <div class="main-wrapper">
    <main>
      <table>
        <thead>
          <tr :class="tableClass">
            <th></th>
            <th>Title</th>
            <th>Company</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobsDisplayed" :class="tableClass">
            <td>
              <img alt="-----" :src="getFavicon(job['url'])" height="32px" width="32px">
            </td>
            <td>{{ job['title'] }}</td>
            <td>{{ job['company'] }}</td>
            <td>{{ job['date'] }}</td>
            <td>
              <a :href="job['url']">Visit</a>
            </td>
            <td v-if="editingJobs && !selectedJobID">
              <button @click="selectJob(job['id'])">Edit</button>
            </td>
            <td v-if="deletingJobs">
              <button @click="deleteJob(job['id'])">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
    <aside>
      <div class="function-wrapper" v-if="showFunctions">
        <button @click="startNewJob()">New Job</button>
        <button @click="startEditJob()">Edit Job</button>
        <button @click="startDeleteJob()">Delete Job</button>
      </div>
      <div class="done-wrapper" v-if="showExtraJobButtons">
        <button @click="finalizeEditJob()" v-if="editingJobs && !selectedJobID">Done</button>
        <button @click="finalizeDeleteJob()" v-if="deletingJobs">Done</button>
      </div>
      <form class="input-wrapper" v-if="showInputs">
        <input v-model="tempTitle" placeholder="Job Title">
        <input v-model="tempCompany" placeholder="Company Name">
        <input type="date" v-model="tempDate" placeholder="Date Applied">
        <input type="url" v-model="tempURL" placeholder="Link">
        <div class="input-button-wrapper" v-if="addingJobs">
          <button @click="finalizeNewJob()">Add Job</button>
          <button @click="abortNewJob()">Cancel</button>
        </div>
        <div class="input-button-wrapper" v-if="editingJobs">
          <button @click="editJob()">Save</button>
          <button @click="deselectJob()">Cancel</button>
        </div>
      </form>
    </aside>
  </div>
</template>

<style>
:root {
  --bg-col: #f7f7f7;
  --header-col: #e7e7e7;
  --table-col: #e7e7e7;
  --table-head-col: #c7c7c7;
  --table-alt-col: #d7d7d7;
  --aside-col: #d7d7d7;
  --text-col: #0f0f0f;
  --subtext-col: #8f8f8f;
  --button-col: #e7e7e7;
  --border-col: #bfbfbf;
}
* {
  padding: 0;
  margin: 0;
  font-family: serif;
}

body {
  background-color: var(--bg-col);
  color: var(--text-col);
}

button {
  font-family: sans-serif;
  color: var(--subtext-col);
  padding: 0.2% 1%;
}

header {
  background: var(--header-col);
  width: calc(100vw - 40px);
  padding: 0 20px;
  height: 62px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 24px;
  border-bottom: 2px solid var(--border-col);
  white-space: nowrap;
}

header > * {
  margin: 0 10px;
}

.subtitle {
  color: var(--subtext-col);
}

.main-wrapper {
  display: grid;
  grid-template-columns: 4fr 1fr;
  height: calc(100vh - 64px);
}

table {
  width: calc(100% - 40px);
  margin: 20px;
  background: var(--table-col);
  padding: 8px;
  border: 2px solid var(--border-col);
}

thead {
  transform: translateY(2px);
}

tr {
  display: grid;
  grid-template-columns: 54px 1fr 1fr 120px 64px;
  height: 50px;
  vertical-align: bottom;
}

/* when Edit/Delete buttons active */
.tr-extended {
  grid-template-columns: 54px 1fr 1fr 120px 64px 64px;
}

th, td {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-col);

  overflow: hidden;
  white-space: nowrap;
}

th {
  font-size: 140%;
  background: var(--table-head-col);
}

td {
  font-size: 120%;
}

th:nth-child(1), th:nth-child(5), th:nth-child(6) {
  background: none;
  border: none;
}

tr:nth-child(even) {
  background: var(--table-alt-col);
}

aside {
  background: var(--aside-col);
  border-left: 2px solid var(--border-col);
}

.function-wrapper {
  height: (100% - 64px);
  text-align: center;
  padding-top: 20px;
}
.function-wrapper button {
  width: 60%;
  font-size: 32px;
  margin: 10px;

  min-width: 120px;
}

.done-wrapper {
  padding-top: 40px;
  text-align: center;
}
.done-wrapper button {
  font-size: 24px;
}

.input-wrapper {
  margin: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper > * {
  font-size: 24px;
}

.input-wrapper button {
  font-size: 18px;
}

.input-button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

</style>
