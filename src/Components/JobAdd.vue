<script setup>
import { ref } from 'vue'
import { db_jobs_insert, db_cats_query } from '../dbUtil'
import { getTodayStr } from '../util'
import VueTagsInput from '@sipec/vue3-tags-input'

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
const tempDate = ref(getTodayStr()) // default to today's date
const tempURL = ref("")
const tempNotes = ref("")
const tempCat = ref(props.selectedCat)
const tempTags = ref([])
const tag = ref("")

function addJob() {
  const newJob = {
    title: tempTitle.value,
    company: tempCompany.value,
    date: new Date(tempDate.value),
    url: tempURL.value,
    notes: tempNotes.value,
    catID: tempCat.value['id'],
    tags: JSON.parse(JSON.stringify(tempTags.value)) // deepcopy
  }
  // insert into DB
  db_jobs_insert(newJob)
  emit('job_add', tempCat.value)
}

function cancelAdd(){
  emit('cancel_add')
}
</script>

<template>
  <form class="input-wrapper" @submit.prevent="addJob">
    <label for="input_title">Job Title<span class="require"> *</span></label>
    <input v-model="tempTitle" id="input_title" maxlength="50" required>
    <label for="input_company">Company Name<span class="require"> *</span></label>
    <input v-model="tempCompany" id="input_company" maxlength="50" required>
    <label for="input_date">Date Applied<span class="require"> *</span></label>
    <input type="date" v-model="tempDate" id="input_date" required>
    <label for="input_url">Link</label>
    <input type="url" v-model="tempURL" id="input_url" placeholder="https://..." maxlength="300" autocomplete="off">
    <label for="input_notes">Notes</label>
    <textarea v-model="tempNotes" id="input_notes" maxlength="300" rows="3"></textarea>
    <label for="input_tags">Tags</label>
    <VueTagsInput v-model="tag" id="input_tags" :tags="tempTags" @tags-changed="(tags) => {tempTags = tags}" :max-tags="20" :maxlength="42"/>
    <label for="input_table">Table<span class="require"> *</span></label>
    <select v-model="tempCat" id="input_table" required>
      <option v-for="cat in cats" :value="cat">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <input type="submit" value="Add Job" />
      <button @click="cancelAdd">Cancel</button>
    </div>
  </form>
</template>

<style>
</style>