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
  const newJob = {
    title: tempTitle.value,
    company: tempCompany.value,
    date: new Date(tempDate.value),
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
    <select v-model="tempCatID" id="input_table">
      <option v-for="cat in cats" :value="cat['id']" :selected="props.selectedCat['id'] == cat['id']">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <button @click="addJob">Add Job</button>
      <button @click="cancelAdd">Cancel</button>
    </div>
  </form>
</template>