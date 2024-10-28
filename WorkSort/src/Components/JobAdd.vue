<script setup>
import { ref } from 'vue'
import { db_insert } from '../dbUtil'

const emit = defineEmits([
  'job_add',
  'cancel_add'
])

// input variables
const tempTitle = ref("")
const tempCompany = ref("")
const tempDate = ref("")
const tempURL = ref("")
const tempNotes = ref("")

function addJob() {
  const newJob = {
    title: tempTitle.value,
    company: tempCompany.value,
    date: tempDate.value,
    url: tempURL.value,
    notes: tempNotes.value
  }
  // insert into DB
  db_insert(newJob)
  emit('job_add')
}

function cancelAdd(){
  emit('cancel_add')
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
      <button @click="addJob">Add Job</button>
      <button @click="cancelAdd">Cancel</button>
    </div>
  </form>
</template>