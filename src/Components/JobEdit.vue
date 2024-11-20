<script setup>
import { ref } from 'vue'
import { db_jobs_update, db_cats_query } from '../dbUtil'
import { dateToStr } from '../util'
import VueTagsInput from '@sipec/vue3-tags-input'

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
const tempTags = ref(props.selectedJob['tags'])
const tag = ref("")

function editJob() {
  const editedJob = {
    title: tempTitle.value,
    company: tempCompany.value,
    date: new Date(tempDate.value),
    url: tempURL.value,
    notes: tempNotes.value,
    catID: tempCat.value['id'],
    tags: JSON.parse(JSON.stringify(tempTags.value)), // deepcopy
    id: props.selectedJob['id']
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
  <form class="input-wrapper" @submit.prevent="editJob">
    <label for="input_title"><span class="require">* </span>Job Title</label>
    <input v-model="tempTitle" id="input_title" maxlength="50" required>
    <label for="input_company"><span class="require">* </span>Company Name</label>
    <input v-model="tempCompany" id="input_company" maxlength="50" required>
    <label for="input_date"><span class="require">* </span>Date Applied</label>
    <input type="date" v-model="tempDate" id="input_date" required>
    <label for="input_url">Link</label>
    <input type="url" v-model="tempURL" id="input_url" placeholder="https://..." maxlength="300" autocomplete="off">
    <label for="input_notes">Notes</label>
    <textarea v-model="tempNotes" id="input_notes" maxlength="300" rows="3"></textarea>
    <label for="input_tags">Tags</label>
    <VueTagsInput v-model="tag" id="input_tags" :tags="tempTags" @tags-changed="(tags) => {tempTags = tags}" :max-tags="20" :maxlength="42"/>
    <label for="input_table"><span class="require">* </span>Table</label>
    <select v-model="tempCat" id="input_table" required>
      <option v-for="cat in cats" :value="cat">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <input type="submit" value="Save" />
      <button @click="cancelEdit">Cancel</button>
    </div>
  </form>
</template>