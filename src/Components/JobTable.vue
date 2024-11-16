<script setup>
import { db_jobs_query, db_cats_query } from '../dbUtil'
import { dateToShortStr, getFavicon } from '../util'
import { computed, toRef, watch } from 'vue'

const props = defineProps({
  selectedCat: Object,
  enlargeAside: Boolean
})

const emit = defineEmits(['job_select', 'cat_select', 'cat_edit', 'cat_delete'])

const selectedCatRef = toRef(props, 'selectedCat')

// table of jobs, reactive from Dexie's liveQuery()
var jobs = db_jobs_query(1)

// update whenever selectedCat changes
watch(selectedCatRef, (newCat) => {
  //console.log(`selectedCat changed: id = ${newCat['id']}`)
  jobs = db_jobs_query(newCat['id'])
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
const hasNextCat = computed(() => (cats.value != undefined) && selectedCatIndex.value < cats.value.length - 1 )
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
              <th>Title</th>
              <th>Company</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobs">
              <td>
                <img alt="-----" :src="getFavicon(job['url'])" height="32px" width="32px">
              </td>
              <td>{{ job['title'] }}</td>
              <td>{{ job['company'] }}</td>
              <td>{{ dateToShortStr(job['date']) }}</td>
              <td>
                <!-- disable view buttons if the aside is in focus -->
                <button @click="emit('job_select', job)" :disabled="enlargeAside">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* this fade transition is CRUCIAL for smooth table-to-table browsing!! */
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-leave-to {
  opacity: 0;
}

#table-wrapper {
  --table-col: #e7e7e7;
  --table-head-col: #c7c7c7;
  --table-alt-col: #d7d7d7;

  width: calc(100% - 60px);
  margin: 20px;
  background: var(--table-col);
  padding: 8px;
  border: 2px solid var(--border-col);
}

p {
  font-size: 24px;
  text-align: center;
  margin-top: 4px;
}

.table-header-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 5px;
}

.table-nav {
  display: flex;
  justify-content: space-between;
  width: min(500px, 100%);
}

.table-header-wrapper button {
  height: 36px;
  font-size: 20px;
}

table {
  width: 100%;
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

@media(width <=720px) {
  /* hide icon */
  tr {
    grid-template-columns: 1fr 1fr 82px 46px;
  }

  th:first-child, td:first-child {
    display: none;
  }
}
</style>