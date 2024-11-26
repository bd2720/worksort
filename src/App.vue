<script setup>
import { ref, computed } from 'vue'
import JobTable from './Components/JobTable.vue'
import JobView from './Components/JobView.vue'
import JobAdd from './Components/JobAdd.vue'
import JobEdit from './Components/JobEdit.vue'
import JobDelete from './Components/JobDelete.vue'

import CatAdd from './Components/CatAdd.vue'
import CatEdit from './Components/CatEdit.vue'
import CatDelete from './Components/CatDelete.vue'

import SearchFields from './Components/SearchFields.vue'

const addingJob = ref(false)
const editingJob = ref(false)
const deletingJob = ref(false)
// reference to the selected job object
const selectedJob = ref(undefined)
const jobSelected = computed(() => Boolean(selectedJob.value))

// main category; should not be edited or deleted
const mainCat = {name:'Main', id:1}

const addingCat = ref(false)
const editingCat = ref(false)
const deletingCat = ref(false)
// reference to the selected table
const selectedCat = ref(mainCat)

// true if querying instead of navigating tables
const searchingJobs = ref(false)
// search fields
const fields = ref(undefined)

// show extended job info (if a job is selected)
const showExtendedJob = computed(() => {
  return jobSelected.value && !editingJob.value
})
// enlarge the aside if sub-menus are active
const enlargeAside = computed(() => {
  return addingJob.value || jobSelected.value || addingCat.value || editingCat.value || deletingCat.value || searchingJobs.value
})
</script>

<template>
  <header>
    <h1>WorkSort</h1>
    <p class="subtitle">Organize your job applications</p>
  </header>
  <div class="main-wrapper">
    <!-- TABLE -->
    <main>
      <JobTable :enlargeAside="enlargeAside" :selectedCat="selectedCat" :searchingJobs="searchingJobs" :fields="fields"
        @job_select="(job) => { selectedJob = job }" @cat_select="(cat) => { selectedCat = cat }"
        @cat_edit="editingCat = true" @cat_delete="deletingCat = true" />
    </main>
    <aside :class="enlargeAside ? 'enlargeAside' : ''">
      <!-- ADD STUFF -->
      <div class="function-wrapper" v-if="!enlargeAside">
        <button @click="addingJob = true">New Job</button>
        <button @click="addingCat = true">New Table</button>
        <button @click="searchingJobs = true">Search Jobs</button>
      </div>
      <div class="add-job-wrapper" v-if="addingJob">
        <JobAdd :selectedCat="selectedCat" @job_add="(cat) => { addingJob = false; selectedCat = cat }"
          @cancel_add="addingJob = false" />
      </div>
      <div class="add-cat-wrapper" v-if="addingCat">
        <CatAdd @cat_add="addingCat = false" @cancel_add="addingCat = false" />
      </div>
      <!-- JOB VIEW/EDIT/DEL -->
      <div class="view-job-wrapper" v-if="showExtendedJob">
        <JobView :selectedJob="selectedJob" :deletingJob="deletingJob" :searchingJobs="searchingJobs"
          @job_deselect="selectedJob = undefined" @job_edit="editingJob = true" @job_delete="deletingJob = true" />
      </div>
      <div class="edit-job-wrapper" v-if="editingJob">
        <JobEdit :selectedJob="selectedJob" :selectedCat="selectedCat"
          @job_edit="(job, cat) => { editingJob = false; selectedJob = job; selectedCat = cat }"
          @cancel_edit="editingJob = false" />
      </div>
      <div class="delete-job-wrapper" v-if="deletingJob">
        <JobDelete :selectedJobID="selectedJob['id']" @job_delete="deletingJob = false; selectedJob = undefined"
          @cancel_delete="deletingJob = false" />
      </div>
      <!-- CATEGORY EDIT/DEL -->
      <div class="edit-cat-wrapper" v-if="editingCat">
        <CatEdit :selectedCat="selectedCat" @cat_edit="(cat) => { editingCat = false; selectedCat = cat }"
          @cancel_edit="editingCat = false" />
      </div>
      <div class="delete-cat-wrapper" v-if="deletingCat">
        <CatDelete :selectedCatID="selectedCat['id']" @cat_delete="deletingCat = false; selectedCat = mainCat"
          @cancel_delete="deletingCat = false" />
      </div>
      <!-- SEARCH -->
      <div class="search-wrapper" v-if="searchingJobs && !jobSelected">
        <SearchFields :fields="fields" @search_submit="(flds) => { fields = flds }" @cancel_search="searchingJobs = false;" />
      </div>
    </aside>
  </div>
</template>

<style>
@import './assets/colors.css';

* {
  padding: 0;
  margin: 0;
  font-family: serif;
}

body {
  background-color: var(--bg-col);
  color: var(--text-col);
  overflow-x: hidden;
}

button, input[type="submit"] {
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

@media(width <= 1280px){
  .enlargeAside {
    width: 300px;
  }
}

/* display aside on top of main, for mobile */
@media(width <= 926px){

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

@media(width <= 720px){
  header {
    justify-content: center;
  }
  header p {
    display: none;
  }
}
</style>
