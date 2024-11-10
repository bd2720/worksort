<script setup>
import { ref } from 'vue'
import { db_jobs_update, db_cats_query } from '../dbUtil'
import { dateToStr } from '../util'

const props = defineProps({
  selectedCat: Object,
  selectedJob: Object
})

const emit = defineEmits([
  'job_edit',
  'cancel_edit'
])

// category names
const cats = db_cats_query(props.selectedCat['id'])

/* input variables can be initialized here, since we know this
component will only be created after a job is selected */
const tempTitle = ref(props.selectedJob['title'])
const tempCompany = ref(props.selectedJob['company'])
const tempDate = ref(dateToStr(props.selectedJob['date']))
const tempURL = ref(props.selectedJob['url'])
const tempNotes = ref(props.selectedJob['notes'])
const tempCat = ref(props.selectedCat)

function editJob() {
  const editedJob = {
    title: tempTitle.value,
    company: tempCompany.value,
    date: new Date(tempDate.value),
    url: tempURL.value,
    notes: tempNotes.value,
    catID: tempCat.value['id'],
    id: props.selectedJob['id'],
  }
  // save new job info to db
  db_jobs_update(editedJob)
  emit('job_edit', editedJob, tempCat.value)
}

function cancelEdit() {
  emit('cancel_edit')
}
</script>

<template>
  <form class="input-wrapper">
    <input v-model="tempTitle" placeholder="Job Title">
    <input v-model="tempCompany" placeholder="Company Name">
    <input type="date" v-model="tempDate" placeholder="Date Applied">
    <input type="url" v-model="tempURL" placeholder="Link">
    <input v-model="tempNotes" placeholder="Notes (optional)">
    <select v-model="tempCat">
      <option v-for="cat in cats" :value="cat">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <button @click="editJob()">Save</button>
      <button @click="cancelEdit()">Cancel</button>
    </div>
  </form>
</template>