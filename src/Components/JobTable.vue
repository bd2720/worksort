<script setup>
import { db_jobs_query, db_cats_query } from '../dbUtil'
import { dateToShortStr, getFavicon, sortJobs, capitalize } from '../util'
import { ref, computed, toRef, watch } from 'vue'

const props = defineProps({
  selectedCat: Object,
  enlargeAside: Boolean
})

const emit = defineEmits(['job_select', 'cat_select', 'cat_edit', 'cat_delete'])

const selectedCatRef = toRef(props, 'selectedCat')

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
watch(selectedCatRef, (newCat) => {
  jobs = db_jobs_query(newCat['id'])
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
        <div class="table-header-wrapper">
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
          You haven't added any jobs to this table yet. Click <strong>New Job</strong> to begin organizing, or
          add some jobs from another table!
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
            <tr v-for="job in sortedJobs">
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
</style>