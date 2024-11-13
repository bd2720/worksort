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
  // emit success, new job and cat to parent
  emit('job_edit', editedJob, tempCat.value)
}

function cancelEdit() {
  emit('cancel_edit')
}
</script>

<template>
  <form class="input-wrapper">
    <label for="input_title">Job Title</label>
    <input v-model="tempTitle" id="input_title">
    <label for="input_company">Company Name</label>
    <input v-model="tempCompany" id="input_company">
    <label for="input_date">Date Applied</label>
    <input type="date" v-model="tempDate" id="input_date">
    <label for="input_url">Link</label>
    <input type="url" v-model="tempURL" id="input_url" placeholder="https://...">
    <label for="input_notes">Notes</label>
    <input v-model="tempNotes" id="input_notes">
    <label for="input_table">Table</label>
    <select v-model="tempCat" id="input_table">
      <option v-for="cat in cats" :value="cat">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <button @click="editJob()">Save</button>
      <button @click="cancelEdit()">Cancel</button>
    </div>
  </form>
</template>