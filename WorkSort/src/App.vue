<script setup>
import { ref, computed } from 'vue'
import JobTable from './Components/JobTable.vue'
import JobView from './Components/JobView.vue'
import JobAdd from './Components/JobAdd.vue'
import JobEdit from './Components/JobEdit.vue'
import JobDelete from './Components/JobDelete.vue'


// show functional buttons (Add)
const showFunctions = computed(() => {
  return !addingJob.value && !editingJob.value && !jobSelected.value
})
// show extended job info (if a job is selected)
const showExtendedJob = computed(() => {
  return jobSelected.value && !editingJob.value
})
// enlarge the aside if sub-menus are active
const enlargeAside = computed(() => {
  return addingJob.value || jobSelected.value
})

const addingJob = ref(false)
function startNewJob() {
  addingJob.value = true
}

const editingJob = ref(false)
function startEditJob() {
  editingJob.value = true
}

const deletingJob = ref(false)

// reference to the selected job object
const selectedJob = ref(undefined)
const jobSelected = computed(() => Boolean(selectedJob.value))

function selectJob(job) {
  // save the selected job
  selectedJob.value = job
}
function deselectJob(){
  // set the selected job back to undefined
  selectedJob.value = undefined
}
// delete selectedJob from the list
function deleteJob() {
  deletingJob.value = true
}

</script>

<template>
  <header>
    <h1>WorkSort</h1>
    <p class="subtitle">Organize your job applications</p>
  </header>
  <div class="main-wrapper">
    <main>
      <JobTable :enlargeAside="enlargeAside" @job_select="selectJob"/>
    </main>
    <aside :class="enlargeAside ? 'enlargeAside' : ''">
      <div class="function-wrapper" v-if="showFunctions">
        <button @click="startNewJob()">New Job</button>
      </div>
      <div class="add-wrapper" v-if="addingJob">
        <JobAdd @job_add="addingJob = false" @cancel_add="addingJob = false"/>
      </div>
      <div class="view-wrapper" v-if="showExtendedJob">
        <JobView :selectedJob="selectedJob" @job_deselect="deselectJob" @job_edit="startEditJob" @job_delete="deleteJob"/>
      </div>
      <div class="edit-wrapper" v-if="editingJob">
        <JobEdit :selectedJob="selectedJob" @job_edit="editingJob = false" @cancel_edit="editingJob = false"/>
      </div>
      <div class="delete-wrapper" v-if="deletingJob">
        <JobDelete :selectedJob="selectedJob" @job_delete="deletingJob = false; deselectJob()"/>
      </div>
    </aside>
  </div>
</template>

<style>
:root {
  --bg-col: #f7f7f7;
  --header-col: #e7e7e7;
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
  /* ensure content (aside) extends at least to the screen bottom */
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

main {
  width: 100%;
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
}
</style>
