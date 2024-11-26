<script setup>
import { ref } from 'vue'
import { db_cats_query } from '../dbUtil'
import VueTagsInput from '@sipec/vue3-tags-input'

const emit = defineEmits([
  'search_submit',
  'cancel_search'
])

// category names
const cats = db_cats_query()

// input variables
const tempTitle = ref("")
const tempCompany = ref("")
const tempDateMin = ref("")
const tempDateMax = ref("")
const tempCats = ref([])
const tempTags = ref([])
const tag = ref("")

function submitSearch() {
  const fields = {
    title: tempTitle.value,
    company: tempCompany.value,
    dateMin: new Date(tempDateMin.value),
    dateMax: new Date(tempDateMax.value),
    cats: tempCats.value.map(cat => cat['id']),
    tags: tempTags.value.map(tag => tag['text'])
  }
  // emit search object to parent
  emit('search_submit', fields)
}

// clear search fields
function clearSearch(){
  tempTitle.value = ""
  tempCompany.value = ""
  tempDateMin.value = ""
  tempDateMax.value = ""
  tempCats.value = []
  tempTags.value = []
  tag.value = ""
}

function cancelSearch(){
  emit('cancel_search')
}

</script>

<template>
  <form class="input-wrapper" @submit.prevent="submitSearch">
    <label for="input_title">Job Title<span class="tip"> (starts with)</span></label>
    <input v-model="tempTitle" id="input_title" maxlength="50">
    <label for="input_company">Company Name<span class="tip"> (starts with)</span></label>
    <input v-model="tempCompany" id="input_company" maxlength="50">
    <label for="input_date_min">From<span class="tip"> (date)</span></label>
    <input type="date" v-model="tempDateMin" id="input_date_min">
    <label for="input_date_max">To<span class="tip"> (date)</span></label>
    <input type="date" v-model="tempDateMax" id="input_date_max">
    <label for="input_tags">Tags<span class="tip"> (any of)</span></label>
    <VueTagsInput v-model="tag" id="input_tags" :tags="tempTags" @tags-changed="(tags) => {tempTags = tags}" :max-tags="20" :maxlength="42"/>
    <label for="input_table">Tables<span class="tip"> (one of)</span></label>
    <select v-model="tempCats" id="input_table" multiple>
      <option v-for="cat in cats" :key="cat['id']" :value="cat">{{cat['name']}}</option>
    </select>
    <div class="input-button-wrapper">
      <input type="submit" value="Search" />
      <button type="button" @click="clearSearch">Clear</button>
      <button @click="cancelSearch">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
@import '../assets/fields.css';
@import '../assets/colors.css';

.tip {
  color: var(--subtext-col);
  font-size: 80%;
}

</style>