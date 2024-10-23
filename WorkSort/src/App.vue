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
const tempNotes = ref("")
// clear fields
function clearInputs() {
  tempTitle.value = ""
  tempCompany.value = ""
  tempDate.value = ""
  tempURL.value = ""
  tempNotes.value = ""
}

// show input fields if adding jobs
const showInputs = computed(() => {
  return addingJob.value || editingJob.value
})

// show functional buttons (Add, Edit, Delete)
const showFunctions = computed(() => {
  return !addingJob.value && !editingJob.value && !selectedJobID.value
})

// show extended job info (if a job is selected)
const showExtendedJob = computed(() => {
  return selectedJobID.value && !editingJob.value
})

const enlargeAside = computed(() => {
  return showInputs.value || showExtendedJob.value
})

const addingJob = ref(false)
function startNewJob() {
  clearInputs()
  addingJob.value = true
}

const editingJob = ref(false)
function startEditJob() {
  editingJob.value = true
  // init. fields with specified job information
  tempTitle.value = selectedJob.value['title']
  tempCompany.value = selectedJob.value['company']
  tempDate.value = selectedJob.value['date']
  tempURL.value = selectedJob.value['url']
  tempNotes.value = selectedJob.value['notes']
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
    notes: tempNotes.value
  })
  // sort new list
  sortJobs()
  // no longer adding the job
  addingJob.value = false
}

function abortNewJob() {
  addingJob.value = false
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

function selectJob(jobID) {
  // save the selected job id
  selectedJobID.value = jobID
}

function deselectJob(){
  // set the selected job back to null
  selectedJobID.value = null
}

// exit editing mode
function finalizeEditJob() {
  // save new information to the currently selected job
  selectedJob.value['title'] = tempTitle.value
  selectedJob.value['company'] = tempCompany.value
  selectedJob.value['date'] = tempDate.value
  selectedJob.value['url'] = tempURL.value
  selectedJob.value['notes'] = tempNotes.value
  // sort updated list
  sortJobs()
  // done editing
  editingJob.value = false
}

// when "Cancel" is pressed while editing a specific job
function abortEdit() {
  selectedJobID.value = null
}


// delete the job associated with the selectedJobID
function deleteJob() {
  // remove job with matching ID
  jobs.value = jobs.value.filter((job) => job['id'] != selectedJobID.value)
  // deselect job, since it no longer exists
  selectedJobID.value = null
}

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

// convert date to mm/dd/yy
function shortenDate(dateStr){
  if(!dateStr) return ""
  const y = dateStr[2] + dateStr[3]
  const m = dateStr[5] + dateStr[6]
  const d = dateStr[8] + dateStr[9]
  return `${m}/${d}/${y}`
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
          <tr>
            <th></th>
            <th>Title</th>
            <th>Company</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobsDisplayed">
            <td>
              <img alt="-----" :src="getFavicon(job['url'])" height="32px" width="32px">
            </td>
            <td>{{ job['title'] }}</td>
            <td>{{ job['company'] }}</td>
            <td>{{ shortenDate(job['date']) }}</td>
            <td>
              <!-- disable view buttons if the aside is in focus -->
              <button @click="selectJob(job['id'])" :disabled=" enlargeAside ? true : false">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
    <aside :class="enlargeAside ? 'enlargeAside' : ''">
      <div class="function-wrapper" v-if="showFunctions">
        <button @click="startNewJob()">New Job</button>
      </div>
      <form class="input-wrapper" v-if="showInputs">
        <input v-model="tempTitle" placeholder="Job Title">
        <input v-model="tempCompany" placeholder="Company Name">
        <input type="date" v-model="tempDate" placeholder="Date Applied">
        <input type="url" v-model="tempURL" placeholder="Link">
        <input v-model="tempNotes" placeholder="Notes (optional)">
        <div class="input-button-wrapper" v-if="addingJob">
          <button @click="finalizeNewJob()">Add Job</button>
          <button @click="abortNewJob()">Cancel</button>
        </div>
        <div class="input-button-wrapper" v-if="editingJob">
          <button @click="finalizeEditJob()">Save</button>
          <button @click="abortEdit()">Cancel</button>
        </div>
      </form>
      <div class="view-wrapper" v-if="showExtendedJob">
        <div class="info-wrapper">
          <div class="info-item">
            <h3>Job Title</h3>
            <p>
              {{ selectedJob['title'] }}
            </p>
          </div>
          <div class="info-item">
            <h3>Company Name</h3>
            <p>
              {{ selectedJob['company'] }}
            </p>
          </div>
          <div class="info-item">
            <h3>Date Applied</h3>
            <p>
              {{ selectedJob['date'] }}
            </p>
          </div>
          <div class="info-item">
            <h3>Link</h3>
            <p id="info-link">
              <a :href="selectedJob['url']">{{selectedJob['url']}}</a>
            </p>
          </div>
          <div class="info-item">
            <h3>Notes</h3>
            <p id="info-notes">
              {{selectedJob['notes']}}
            </p>
          </div>
        </div>
        <div class="info-option-wrapper">
          <button @click="deselectJob()">Close</button>
          <button @click="startEditJob()">Edit</button>
          <button @click="deleteJob()">Delete</button>
        </div>
      </div>
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
  --info-col: #e7e7e7;
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
  width: calc(100vw - 160px);
  padding: 0 80px;
  height: 62px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  border-bottom: 2px solid var(--border-col);
  white-space: nowrap;
  overflow: hidden;
}

header > * {
  margin: 0 10px;
}

.subtitle {
  color: var(--subtext-col);
}

.main-wrapper {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

main {
  width: 100%;
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
  grid-template-columns: 54px 1fr 1fr 82px 46px;
  height: 50px;
  vertical-align: bottom;
}

th, td {
  border: 1px solid var(--border-col);
  padding: 12px 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td:first-child {
  padding: 8px 0 0 0;
  text-align: center;
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
  width: 200px;
  background: var(--aside-col);
  border-left: 2px solid var(--border-col);
  flex-shrink: 0;
}

.enlargeAside {
  width: 400px;
}

.function-wrapper {
  height: calc(100% - 64px);
  text-align: center;
  padding-top: 20px;
}
.function-wrapper button {
  width: 60%;
  font-size: 32px;
  margin: 10px;

  min-width: 120px;
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

.view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-item {
  padding: 4px 0;
}

.info-item h3 {
  padding-left: 2px;
}

.info-item p {
  min-height: 28px;
  width: 300px;
  font-size: 24px;
  background: var(--info-col);
  border: 1px solid var(--border-col); 
  margin-top: 4px;
  padding: 1px 4px;
}

/* display link, wrap if necessary */
#info-link {
  word-wrap: break-word;
}

/* make notes field display taller */
#info-notes {
  min-height: 84px;
}

.view-wrapper button {
  font-size: 18px;
}

.info-option-wrapper {
  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 10px 0;
}

/* display aside on top of main, for mobile */
@media(width <= 720px){
  header {
    justify-content: center;
  }
  header p {
    display: none;
  }

  .main-wrapper {
    flex-direction: column-reverse;
    justify-content: flex-end;
  }

  aside {
    width: 100% !important;
    border-left: none;
    border-bottom: 2px solid var(--border-col);
  }

  .function-wrapper {
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .function-wrapper button {
    font-size: 24px;
    padding: 10px 5px;
  }

  /* hide icon */
  tr {
    grid-template-columns: 1fr 1fr 82px 46px;
  }

  th:first-child, td:first-child {
    display: none;
  }
}

</style>
