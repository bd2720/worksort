<script setup>
import { db_jobs_query, db_cats_query, db_jobs_search } from '../dbUtil'
import { dateToShortStr, getFavicon, sortJobs, capitalize } from '../util'
import { ref, computed, toRef, watch } from 'vue'

const props = defineProps({
  selectedCat: Object,
  searchingJobs: Boolean,
  fields: Object,
  enlargeAside: Boolean,
})

const emit = defineEmits(['job_select', 'cat_select', 'cat_edit', 'cat_delete'])


// table of jobs, reactive from Dexie's liveQuery()
var jobs = db_jobs_query(1)

// active field for sorting
const sortField = ref('date')
// sort order for active field
const sortDesc = ref(true)

// computed jobs, sorted by descending date by default
var sortedJobs = computed(() => sortJobs(jobs.value, sortField.value, sortDesc.value))

// function called when a column label is clicked
function selectSortField(field){
  // if field already selected, flip sorting order
  if(field === sortField.value){
    sortDesc.value = !sortDesc.value
    return
  }
  // if new field, change selected field.
  sortField.value = field
  sortDesc.value = false
}
// update jobs and sortedJobs whenever selectedCat changes
const selectedCatRef = toRef(props, 'selectedCat')
watch(selectedCatRef, (newCat) => {
  jobs = db_jobs_query(newCat['id'])
  sortedJobs = computed(() => sortJobs(jobs.value, sortField.value, sortDesc.value))
})

// watch searchingJobs to handle transition b/t nav and search modes
const searchingJobsRef = toRef(props, 'searchingJobs')
watch(searchingJobsRef, (newSearchingJobs) => {
  // if done searching, display selected category
  jobs = (newSearchingJobs) ? ref([]) : db_jobs_query(props.selectedCat['id'])
  sortedJobs = computed(() => sortJobs(jobs.value, sortField.value, sortDesc.value))
})

// display/refresh search when fields update
const fieldsRef = toRef(props, 'fields')
watch(fieldsRef, async (newFields) => {
  if(!newFields) return; // ensure not null
  jobs.value = await db_jobs_search(newFields)
  sortedJobs = computed(() => sortJobs(jobs.value, sortField.value, sortDesc.value))
})

// array of categories
const cats = db_cats_query()
// compute selected category index based on props.selectedCat
const selectedCatIndex = computed(() => {
  if(cats.value === undefined) return 0
  const index = cats.value.findIndex((cat) => cat['id'] === props.selectedCat['id'])
  if(index != -1) return index
  // if not found, default to main cat.
  return 0
})

const hasPrevCat = computed(() => selectedCatIndex.value > 0 )
const hasNextCat = computed(() => (cats.value !== undefined) && selectedCatIndex.value < cats.value.length - 1 )
function prevCat() {
  if(!hasPrevCat.value) return
    emit('cat_select', cats.value[selectedCatIndex.value - 1])
}
function nextCat() {
  if(!hasNextCat.value) return
  emit('cat_select', cats.value[selectedCatIndex.value + 1])
}
</script>

<template>
  <div id="table-wrapper">
    <transition name="fade">
      <div id="table-content-wrapper" v-if="jobs">
        <div class="table-header-wrapper" v-if="searchingJobs">
          <div class="table-nav">
            <h1 class="search-header">Results: {{ jobs.length }}</h1>
          </div>
        </div>
        <div class="table-header-wrapper" v-else>
          <div class="table-nav">
            <button @click="prevCat" :disabled="!hasPrevCat || enlargeAside" title="Previous table">&lt;</button>
            <transition name="fade">
              <h1 v-if="selectedCat">{{ props.selectedCat['name'] }}</h1>
            </transition>
            <h1 v-if="!selectedCat">Main</h1>
            <button @click="nextCat" :disabled="!hasNextCat | enlargeAside" title="Next table">&gt;</button>
          </div>
          <button @click="emit('cat_edit')" :disabled=" selectedCat['id'] === 1 || enlargeAside" title="Rename this table">Edit</button>
          <button @click="emit('cat_delete')" :disabled="selectedCat['id'] === 1 || enlargeAside || jobs.length > 0" title="Delete this table">Delete</button>
        </div>
        <!-- Failsafe -->
        <p v-if="!jobs">
          Loading jobs...
        </p>
        <p v-else-if="!jobs.length">
          <span v-if="searchingJobs">No results. To search jobs across all tables, fill out some search fields and click <strong>Search</strong>!</span>
          <span v-else>You haven't added any jobs to this table yet. Click <strong>New Job</strong> to begin organizing, or
            add some jobs from another table!</span>
        </p>
        <table v-else>
          <thead>
            <tr>
              <th></th>
              <th v-for="field in ['title', 'company', 'date']" class="sort" @click="selectSortField(field)">
                {{ capitalize(field) }}
                <span v-if="field === sortField">
                  <span v-if="sortDesc">&darr;</span>
                  <span v-else>&uarr;</span>
                </span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in sortedJobs" :key="job['id']">
              <td>
                <img alt="-----" :src="getFavicon(job['url'])" height="32px" width="32px">
              </td>
              <td>{{ job['title'] }}</td>
              <td>{{ job['company'] }}</td>
              <td>{{ dateToShortStr(job['date']) }}</td>
              <td>
                <!-- disable view buttons if the aside is in focus -->
                <button id="view" @click="emit('job_select', job)" :disabled="enlargeAside"><strong>...</strong></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import '../assets/table.css';

.search-header {
  width: 100%;
  text-align: center;
}
</style>