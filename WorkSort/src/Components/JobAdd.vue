<script setup>
import { ref } from 'vue'
import { db_jobs_insert, db_cats_query } from '../dbUtil'

const props = defineProps({
  selectedCat: Object
})

const emit = defineEmits([
  'job_add',
  'cancel_add'
])

// category names
const cats = db_cats_query()

// input variables
const tempTitle = ref("")
const tempCompany = ref("")
const tempDate = ref("")
const tempURL = ref("")
const tempNotes = ref("")
const tempCatID = ref(props.selectedCat['id'])

function addJob() {
  const inputDate = new Date(tempDate.value)
  const newJob = {
    title: tempTitle.value,
    company: tempCompany.value,
    date: inputDate,
    url: tempURL.value,
    notes: tempNotes.value,
    catID: tempCatID.value
  }
  // insert into DB
  db_jobs_insert(newJob)
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
    <select v-model="tempCatID">
      <option v-for="cat in cats" :value="cat['id']" :selected="props.selectedCat['id'] == cat['id']">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <button @click="addJob">Add Job</button>
      <button @click="cancelAdd">Cancel</button>
    </div>
  </form>
</template>