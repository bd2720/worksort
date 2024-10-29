<script setup>
import { ref } from 'vue'
import { db_update } from '../dbUtil'
import { dateToStr } from '../util'

const props = defineProps({
  selectedJob: Object
})

const emit = defineEmits([
  'job_edit',
  'cancel_edit'
])

/* input variables can be initialized here, since we know this
component will only be created after a job is selected */
const tempTitle = ref(props.selectedJob['title'])
const tempCompany = ref(props.selectedJob['company'])
const tempDate = ref(dateToStr(props.selectedJob['date']))
const tempURL = ref(props.selectedJob['url'])
const tempNotes = ref(props.selectedJob['notes'])

function editJob() {
  const editedJob = {
    id: props.selectedJob['id'],
    title: tempTitle.value,
    company: tempCompany.value,
    date: new Date(tempDate.value),
    url: tempURL.value,
    notes: tempNotes.value
  }
  // save new job info to db
  db_update(editedJob)
  emit('job_edit', editedJob)
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
    <div class="input-button-wrapper">
      <button @click="editJob()">Save</button>
      <button @click="cancelEdit()">Cancel</button>
    </div>
  </form>
</template>